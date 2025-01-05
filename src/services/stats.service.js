const { BadRequestError } = require("../cores/error.response");
const DB = require("../db/mysql.init");
const { Op, HasMany, BelongsTo } = require("sequelize");

class StatsService {
  static async getAvailableYears() {
    const scores = await DB.Score.findAll({
      attributes: [
        'school_year_start',
        'semester',
        [DB.sequelize.fn('COUNT', DB.sequelize.col('id')), 'score_count']
      ],
      group: ['school_year_start', 'semester'],
      order: [['school_year_start', 'DESC']]
    });

    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    // Determine current school year
    // School year starts on August 15th and ends on May 15th next year
    let currentSchoolYear;
    if ((currentMonth === 8 && currentDay >= 15) || currentMonth > 8) {
      // After Aug 15th - we're in the new school year
      currentSchoolYear = currentDate.getFullYear();
    } else {
      // Before Aug 15th - we're still in previous school year
      currentSchoolYear = currentDate.getFullYear() - 1;
    }

    // Group by year and check if both semesters exist
    const yearMap = scores.reduce((acc, score) => {
      const year = score.school_year_start;
      if (!acc[year]) {
        acc[year] = { semesters: new Set(), count: 0 };
      }
      acc[year].semesters.add(score.semester);
      acc[year].count += parseInt(score.dataValues.score_count);
      return acc;
    }, {});

    // Convert to array and determine which years are complete
    return Object.entries(yearMap)
      .map(([year, data]) => {
        const yearNum = parseInt(year);
        
        // A school year is complete if:
        // 1. It has both semesters
        // 2. We've passed May 15th of its end year (yearNum + 1)
        const hasBothSemesters = data.semesters.size === 2;
        const schoolYearEndDate = new Date(yearNum + 1, 4, 15); // May 15th of end year (months are 0-based)
        const hasFinished = currentDate > schoolYearEndDate;
        
        const hasCompleteSemesters = hasBothSemesters && hasFinished;

        return {
          year: yearNum,
          hasCompleteSemesters,
          scoreCount: data.count
        };
      })
      .sort((a, b) => b.year - a.year);
  }

  static async getStudentStats() {
    const totalStudents = await DB.Student.count();

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

  static async getScoreStats(schoolYear) {
    const currentDate = new Date();
    if (!schoolYear) {
      // Get the most recent year with complete semesters
      const years = await this.getAvailableYears();
      const completeYear = years.find(y => y.hasCompleteSemesters);
      schoolYear = completeYear ? completeYear.year : currentDate.getFullYear();
    }

    const schoolYearEnd = schoolYear + 1;

    const avgScoresPerSubject = await DB.Score.findAll({
      where: {
        AVG_point: { [Op.not]: null },
        school_year_start: schoolYear,
        school_year_end: schoolYearEnd
      },
      attributes: [
        'subject',
        'semester',
        [DB.sequelize.fn('AVG', DB.sequelize.col('AVG_point')), 'avg_year']
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
      group: ['subject', 'semester', 'Subject.id', 'Subject.name']
    });

    // Calculate yearly averages by combining both semesters
    const subjectYearlyAverages = {};
    avgScoresPerSubject.forEach(score => {
      const subjectName = score.Subject.name;
      if (!subjectYearlyAverages[subjectName]) {
        subjectYearlyAverages[subjectName] = {
          semesters: {},
          yearlyAvg: 0,
          semesterCount: 0
        };
      }
      const avgPoint = parseFloat(score.dataValues.avg_year);
      subjectYearlyAverages[subjectName].semesters[score.semester] = avgPoint;
      subjectYearlyAverages[subjectName].yearlyAvg += avgPoint;
      subjectYearlyAverages[subjectName].semesterCount++;
    });

    // Calculate final yearly averages
    Object.values(subjectYearlyAverages).forEach(subject => {
      if (subject.semesterCount > 0) {
        subject.yearlyAvg = subject.yearlyAvg / subject.semesterCount;
      }
    });

    const passThreshold = 5.0;
    const totalScores = await DB.Score.count({
      where: {
        AVG_point: { [Op.not]: null },
        school_year_start: schoolYear,
        school_year_end: schoolYearEnd
      }
    });

    const passingScores = await DB.Score.count({
      where: {
        AVG_point: {
          [Op.gte]: passThreshold,
          [Op.not]: null
        },
        school_year_start: schoolYear,
        school_year_end: schoolYearEnd
      }
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
              [Op.and]: {
                [Op.gte]: range.min,
                [Op.lt]: range.max,
                [Op.not]: null
              }
            },
            school_year_start: schoolYear,
            school_year_end: schoolYearEnd
          }
        });
        return {
          name: range.label,
          value: count
        };
      })
    );

    const parsedPassRate = parseFloat(passRate)?.toFixed(2);

    return {
      avgScoresPerSubject: Object.entries(subjectYearlyAverages).map(([subject, data]) => ({
        subject,
        yearlyAverage: parseFloat(data.yearlyAvg).toFixed(2),
        semesters: {
          I: data.semesters.I ? parseFloat(data.semesters.I).toFixed(2) : null,
          II: data.semesters.II ? parseFloat(data.semesters.II).toFixed(2) : null
        }
      })),
      passRate: isNaN(parsedPassRate) ? 0 : parsedPassRate,
      scoreDistribution: distribution,
      schoolYear: `${schoolYear}-${schoolYearEnd}`
    };
  }

  static async getSemesterStats(semester, schoolYearStart) {
    if (!semester || !schoolYearStart || !["I", "II"].includes(semester)) {
      throw new BadRequestError("Invalid semester or school year");
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    let semester, schoolYearStart;
    
    // Semester I: August 15 - December 30
    // Semester II: January 1 - May 15
    if ((currentMonth === 8 && currentDay >= 15) || (currentMonth > 8 && currentMonth <= 12)) {
      semester = "I";
      schoolYearStart = currentDate.getFullYear();
    } else if (currentMonth < 8 || (currentMonth === 8 && currentDay < 15)) {
      semester = "II";
      schoolYearStart = currentDate.getFullYear() - 1;
    }

    return this.getSemesterStats(semester, schoolYearStart);
  }

  static async getRegressionData(schoolYear) {
    const currentDate = new Date();
    if (!schoolYear) {
      // Get the most recent year with complete semesters
      const years = await this.getAvailableYears();
      const completeYear = years.find(y => y.hasCompleteSemesters);
      schoolYear = completeYear ? completeYear.year : currentDate.getFullYear();
    }

    const schoolYearEnd = schoolYear + 1;

    const scores = await DB.Score.findAll({
      attributes: [
        "quarter_point_1",
        "quarter_point_2",
        "period_point",
        "final_exam_point",
        "AVG_point",
      ],
      where: {
        school_year_start: schoolYear,
        school_year_end: schoolYearEnd,
        quarter_point_1: { [Op.not]: null },
        quarter_point_2: { [Op.not]: null },
        period_point: { [Op.not]: null },
        final_exam_point: { [Op.not]: null },
        AVG_point: { [Op.not]: null }
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
      ]
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
      schoolYear: `${schoolYear}-${schoolYearEnd}`
    };
  }

  static async getSubjectPassRates(schoolYear) {
    const currentDate = new Date();
    if (!schoolYear) {
      // Get the most recent year with complete semesters
      const years = await this.getAvailableYears();
      const completeYear = years.find(y => y.hasCompleteSemesters);
      schoolYear = completeYear ? completeYear.year : currentDate.getFullYear();
    }

    const schoolYearEnd = schoolYear + 1;
    const passThreshold = 5.0;

    const subjectPassRates = await DB.Score.findAll({
      attributes: [
        [DB.sequelize.fn("COUNT", DB.sequelize.col("*")), "totalScores"],
        [
          DB.sequelize.fn(
            "SUM",
            DB.sequelize.literal(`CASE WHEN AVG_point >= ${passThreshold} THEN 1 ELSE 0 END`),
          ),
          "passingScores",
        ],
      ],
      where: {
        school_year_start: schoolYear,
        school_year_end: schoolYearEnd,
        AVG_point: { [Op.not]: null }
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
      group: ["Subject.id", "Subject.name"],
    });

    const passRates = subjectPassRates.map((subject) => ({
      subject: subject.Subject.name,
      passRate: parseFloat(
        ((subject.dataValues.passingScores / subject.dataValues.totalScores) * 100).toFixed(2),
      ),
      totalStudents: parseInt(subject.dataValues.totalScores),
    }));

    passRates.sort((a, b) => b.passRate - a.passRate);

    return {
      subjectPassRates: passRates,
      highestPassRate: passRates[0],
      lowestPassRate: passRates[passRates.length - 1],
      schoolYear: `${schoolYear}-${schoolYearEnd}`
    };
  }
}

module.exports = StatsService;
