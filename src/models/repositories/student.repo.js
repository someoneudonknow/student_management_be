const { QueryTypes } = require("sequelize");
const { BadRequestError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { deepCleanObject } = require("../../utils");

class StudentRepository {
  static async createStudent(payload, options) {
    return await DB.Student.create(payload, options);
  }

  static async getStudent(id, options = {}) {
    return await DB.Student.findByPk(id, options);
  }

  static async getStudents({ page, limit, filter }) {
    const skip = (page - 1) * limit;
    return await DB.Student.findAndCountAll({
      where: filter,
      limit,
      offset: skip,
    });
  }

  static async updateStudent(id, payload) {
    const foundStudent = await StudentRepository.getStudent(id);
    if (!foundStudent) throw new BadRequestError("Student not found");

    for (const field in payload) {
      foundStudent[field] = payload[field];
    }
    return await foundStudent.save();
  }

  static async deleteStudent(id) {
    return await DB.Student.destroy({ where: { id } });
  }
  static async search({ payload = "" }) {
    //minimum 4 character for full text search
    const queryStr = `SELECT * FROM students s 
      WHERE MATCH(s.first_name, s.last_name) AGAINST (:payload)
      ORDER BY s.first_name, s.last_name ASC LIMIT :limit OFFSET :offset `;

    const foundStudent = await DB.sequelize.query(queryStr, {
      type: QueryTypes.SELECT,
      replacements: { payload: `${payload}`, limit: 10 },
    });
    return foundStudent;
  }
}

module.exports = StudentRepository;
