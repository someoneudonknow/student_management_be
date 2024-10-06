const DB = require("../../db/mysql.init");

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
    for (const field in payload) {
      foundStudent[field] = payload[field];
    }
    return await foundStudent.save();
  }

  static async deleteStudent(id) {
    return await DB.Student.destroy({ where: { id } });
  }
}

module.exports = StudentRepository;
