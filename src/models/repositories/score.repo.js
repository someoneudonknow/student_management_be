const DB = require("../../db/mysql.init");
const { BadRequestError } = require("../../cores/error.response");
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

  static async getScoreOfClass(classId, subjectId, semester) {
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
        school_year_start: {
          [Op.eq]: sequelize.literal(`(
          SELECT MAX(school_year_start) FROM scores
        )`),
        },
      },
    });
  }

  static async createScore(payload, options) {
    await DB.Score.create(payload, options);
  }

  static async updateScore(studentId, subjectId, semester, payload) {
    const foundScore = await DB.Score.findOne({
      where: {
        subject: subjectId,
        student: studentId,
        semester,
        school_year_start: {
          [Op.eq]: sequelize.literal(`(
  SELECT MAX(school_year_start) FROM Scores
)`),
        },
      },
    });

    const fieldsChange = Object.keys(payload);
    for (let field of fieldsChange) {
      foundScore[field] = payload[field];
    }

    return await foundScore.save();
  }

  static async updateScoresOfClass(subjectId, semester, payloads) {
    const res = await DB.sequelize.query(
      "SELECT MAX(school_year_start) as result FROM student_management_dev.scores ORDER BY school_year_start DESC LIMIT 1",
    );

    const school_year_start = res[0][0]["result"];

    const result = await DB.sequelize.transaction(async (t) => {
      console.log("payloads: ", payloads);

      for (let payload of payloads) {
        const { id, ...values } = payload;

        const query = await DB.Score.update(values, {
          where: {
            student: id,
            subject: subjectId,
            semester,
            school_year_start,
          },
          transaction: t,
        });
      }
    });

    return result;
  }
}

module.exports = ScoreRepository;
