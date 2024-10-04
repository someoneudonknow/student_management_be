const DB = require("../../db/mysql.init");

class StudentRepository {
  static async createStudent(payload, options) {
    return await DB.Student.create(payload, options);
  }
}

module.exports = StudentRepository;
