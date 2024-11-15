const {QueryTypes} = require("sequelize");
const DB = require("../../db/mysql.init");

class SubjectRepository {
    static async createSubject(payload) {
        return await DB.Subject.create(payload)
    }

    static async getSubject(subjectId) {
        return await DB.Subject.findByPk(subjectId);
    }

    static async getSubjects(options) {
        return await DB.Subject.findAll(options)
    }
}

module.exports = SubjectRepository