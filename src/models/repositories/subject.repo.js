const { QueryTypes } = require("sequelize");
const DB = require("../../db/mysql.init");

class SubjectRepository {
  static async createSubject(payload) {
    return await DB.Subject.create(payload);
  }

  static async getSubject(subjectId) {
    return await DB.Subject.findByPk(subjectId);
  }

  static async getSubjects(options) {
    return await DB.Subject.findAll(options);
  }

  static async update(id, body) {
    const foundSubject = await this.getSubject(id);
    if (!foundSubject) throw new BadRequestError("Class not found");

    for (const field in body) {
      foundSubject[field] = body[field];
    }

    return await foundSubject.save();
  }

  static async delete(id) {
    return await DB.Subject.destroy({ where: { id } });
  }
}

module.exports = SubjectRepository;
