const { BadRequestError } = require("../cores/error.response");
const DB = require("../db/mysql.init");
const { Op, HasMany, BelongsTo } = require("sequelize");

class StatsService {
  static async getStudentStats() {
    console.log("getStudentStats");
    // Get total number of students
    const totalStudents = await DB.Student.count();

    // Get students per class using the correct relationship
    const studentsPerClass = await DB.Class.findAll({
      attributes: [
        "name",
        "grade",
        [DB.sequelize.fn("COUNT", DB.sequelize.col("students.id")), "studentCount"],
      ],
      include: [
        {
          model: DB.Student,
          attributes: [],
          association: new HasMany(DB.Class, DB.Student, {
            sourceKey: "id",
            foreignKey: "class",
          }),
        },
      ],
      group: ["Class.id", "Class.name", "Class.grade"],
      order: [
        ["grade", "ASC"],
        ["name", "ASC"],
      ],
    });

    return {
      totalStudents,
      studentsPerClass: studentsPerClass.map((c) => ({
        name: c.name,
        count: parseInt(c.dataValues.studentCount),
      })),
    };
  }

  static async getScoreStats() {
    const avgScoresPerSubject = await DB.Score.findAll({
      attributes: [
        [DB.sequelize.fn("AVG", DB.sequelize.col("quarter_point_1")), "avg_quarter_1"],
        [DB.sequelize.fn("AVG", DB.sequelize.col("quarter_point_2")), "avg_quarter_2"],
        [DB.sequelize.fn("AVG", DB.sequelize.col("AVG_point")), "avg_semester"],
      ],
      include: [
        {
          model: DB.Subject,
          attributes: ["name"],
          association: new BelongsTo(DB.Score, DB.Subject, {
            targetKey: "id",
            foreignKey: "subject",
          }),
        },
      ],
      group: ["Subject.id", "Subject.name"],
    });

    const passThreshold = 5.0;
    const totalScores = await DB.Score.count();
    const passingScores = await DB.Score.count({
      where: {
        AVG_point: {
          [Op.gte]: passThreshold,
        },
      },
    });

    const passRate = (passingScores / totalScores) * 100;

    const scoreRanges = [
      { min: 0, max: 4, label: "0-4" },
      { min: 4, max: 5, label: "4-5" },
      { min: 5, max: 7, label: "5-7" },
      { min: 7, max: 8.5, label: "7-8.5" },
      { min: 8.5, max: 10, label: "8.5-10" },
    ];

    const distribution = await Promise.all(
      scoreRanges.map(async (range) => {
        const count = await DB.Score.count({
          where: {
            AVG_point: {
              [Op.gte]: range.min,
              [Op.lt]: range.max,
            },
          },
        });
        return {
          name: range.label,
          value: count,
        };
      }),
    );

    const parsedPassRate = parseFloat(passRate)?.toFixed(2)

    return {
      avgScoresPerSubject: avgScoresPerSubject.map((score) => ({
        subject: score.Subject.name,
        averages: {
          quarter1: parseFloat(score.dataValues.avg_quarter_1).toFixed(2),
          quarter2: parseFloat(score.dataValues.avg_quarter_2).toFixed(2),
          semester: parseFloat(score.dataValues.avg_semester).toFixed(2),
        },
      })),
      passRate: isNaN(parsedPassRate) ? 0 : parsedPassRate,
      scoreDistribution: distribution,
    };
  }

  static async getSemesterStats(semester, schoolYearStart) {
    if (!semester || !schoolYearStart || !['I', 'II'].includes(semester)) {
      throw new BadRequestError('Invalid semester or school year');
    }

    const schoolYearEnd = schoolYearStart + 1;

    const semesterScores = await DB.Score.findAll({
      attributes: ["subject", [DB.sequelize.fn("AVG", DB.sequelize.col("AVG_point")), "avg_point"]],
      where: {
        semester,
        school_year_start: schoolYearStart,
        school_year_end: schoolYearEnd,
      },
      include: [
        {
          model: DB.Subject,
          attributes: ["name"],
          association: new BelongsTo(DB.Score, DB.Subject, {
            targetKey: "id",
            foreignKey: "subject",
          }),
        },
      ],
      group: ["subject", "Subject.id", "Subject.name"],
    });

    return {
      semester,
      schoolYear: `${schoolYearStart}-${schoolYearEnd}`,
      subjectAverages: semesterScores.map((score) => ({
        name: score.Subject.name,
        value: parseFloat(score.dataValues.avg_point).toFixed(2),
      })),
    };
  }

  static async getCurrentSemesterStats() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 8 && currentMonth <= 12 ? "I" : "II";
    const schoolYearStart = currentMonth >= 8 ? currentYear : currentYear - 1;

    return this.getSemesterStats(semester, schoolYearStart);
  }

  static async getRegressionData() {
    const scores = await DB.Score.findAll({
      attributes: [
        "quarter_point_1",
        "quarter_point_2",
        "period_point",
        "final_exam_point",
        "AVG_point",
      ],
      include: [
        {
          model: DB.Subject,
          attributes: ["name"],
          association: new BelongsTo(DB.Score, DB.Subject, {
            targetKey: "id",
            foreignKey: "subject",
          }),
        },
      ],
      where: {
        quarter_point_1: { [Op.not]: null },
        quarter_point_2: { [Op.not]: null },
        period_point: { [Op.not]: null },
        final_exam_point: { [Op.not]: null },
        AVG_point: { [Op.not]: null },
      },
    });

    const regressionData = {
      quarterPoints: scores.map((score) => ({
        x: (parseFloat(score.quarter_point_1) + parseFloat(score.quarter_point_2)) / 2,
        y: parseFloat(score.AVG_point),
        subject: score.Subject.name,
      })),
      periodPoints: scores.map((score) => ({
        x: parseFloat(score.period_point),
        y: parseFloat(score.AVG_point),
        subject: score.Subject.name,
      })),
      finalExamPoints: scores.map((score) => ({
        x: parseFloat(score.final_exam_point),
        y: parseFloat(score.AVG_point),
        subject: score.Subject.name,
      })),
    };

    const calculateCorrelation = (data) => {
      const n = data.length;
      const sumX = data.reduce((acc, val) => acc + val.x, 0);
      const sumY = data.reduce((acc, val) => acc + val.y, 0);
      const sumXY = data.reduce((acc, val) => acc + val.x * val.y, 0);
      const sumX2 = data.reduce((acc, val) => acc + val.x * val.x, 0);
      const sumY2 = data.reduce((acc, val) => acc + val.y * val.y, 0);

      const r =
        (n * sumXY - sumX * sumY) /
        Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

      return parseFloat(r.toFixed(4));
    };

    return {
      data: regressionData,
      correlations: {
        quarterPoints: calculateCorrelation(regressionData.quarterPoints),
        periodPoints: calculateCorrelation(regressionData.periodPoints),
        finalExamPoints: calculateCorrelation(regressionData.finalExamPoints),
      },
    };
  }

  static async getSubjectPassRates() {
    const passThreshold = 5.0;

    const subjectPassRates = await DB.Score.findAll({
      attributes: [
        [DB.sequelize.fn('COUNT', DB.sequelize.col('*')), 'totalScores'],
        [
          DB.sequelize.fn(
            'SUM',
            DB.sequelize.literal(`CASE WHEN AVG_point >= ${passThreshold} THEN 1 ELSE 0 END`)
          ),
          'passingScores'
        ],
      ],
      include: [
        {
          model: DB.Subject,
          attributes: ['name'],
          association: new BelongsTo(DB.Score, DB.Subject, {
            targetKey: 'id',
            foreignKey: 'subject',
          }),
        },
      ],
      group: ['Subject.id', 'Subject.name'],
    });

    const passRates = subjectPassRates.map(subject => ({
      subject: subject.Subject.name,
      passRate: parseFloat(((subject.dataValues.passingScores / subject.dataValues.totalScores) * 100).toFixed(2)),
      totalStudents: parseInt(subject.dataValues.totalScores)
    }));

    // Sort by pass rate to get highest and lowest
    passRates.sort((a, b) => b.passRate - a.passRate);

    return {
      subjectPassRates: passRates,
      highestPassRate: passRates[0],
      lowestPassRate: passRates[passRates.length - 1]
    };
  }
}

module.exports = StatsService;
