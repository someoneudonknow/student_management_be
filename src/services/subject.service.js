const SubjectRepository = require("../models/repositories/subject.repo")

class SubjectService {
    static async createSubject(subject) {
        return await SubjectRepository.createSubject(subject)
    }

    static async getSubject(subjectId) {
        return await SubjectRepository.getSubject(subjectId)
    }

    static async getSubjects(options) {
        return await SubjectRepository.getSubjects(options);
    }
}

module.exports = SubjectService