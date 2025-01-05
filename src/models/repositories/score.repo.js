const DB = require("../../db/mysql.init");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

class ScoreRepository {
  static async getScores(studentId) {
    return await DB.Score.findAll({ where: { student: studentId } });
  }

  static async getScore(studentId, subjectId) {
    return await DB.Score.findOne({ where: { subject: subjectId, student: studentId } });
  }

  static async getScoreOnSubject(subjectId) {
    return await DB.Score.findAll({ where: { subject: subjectId } });
  }

  static async getScoreOfClass(classId, subjectId, semester, schoolYearStart) {
    return await DB.Score.findAll({
      include: {
        model: DB.Student,
        attribute: ["first_name", "last_name"],
        where: { class: classId },
        association: new sequelize.BelongsTo(DB.Score, DB.Student, {
          targetKey: "id",
          foreignKey: "student",
        }),
      },
      where: {
        subject: subjectId,
        semester,
        school_year_start: schoolYearStart,
      },
    });
  }

  static async createScore(payload, options = {}) {
    return await DB.Score.create(payload, options);
  }

  static async updateScore(studentId, subjectId, semester, schoolYearStart, payload) {
    const foundScore = await DB.Score.findOne({
      where: {
        subject: subjectId,
        student: studentId,
        semester,
        school_year_start: schoolYearStart,
      },
    });

    const fieldsChange = Object.keys(payload);
    for (let field of fieldsChange) {
      foundScore[field] = payload[field];
    }

    return await foundScore.save();
  }

  static async updateScoresOfClass(subjectId, semester, schoolYearStart, payloads) {
    // const result = await DB.sequelize.transaction(async (t) => {
    console.log("payloads: ", payloads);

    for (let payload of payloads) {
      const { id, ...values } = payload;

      const foundScore = await DB.Score.findOne({
        where: { student: id, subject: subjectId, semester, school_year_start: schoolYearStart },
      });

      await foundScore.update(values);

      await foundScore.save();

      // await DB.Score.update(values, {
      //   where: {
      //     student: id,
      //     subject: subjectId,
      //     semester,
      //     school_year_start: schoolYearStart,
      //   },
      //   transaction: t,
      //   hooks: true,
      // });
    }
    // });

    // console.log("result: ", result);
    // return result;
  }
}

module.exports = ScoreRepository;
