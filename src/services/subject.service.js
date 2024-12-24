const { NotFoundError } = require("../cores/error.response");
const SubjectRepository = require("../models/repositories/subject.repo");
const { pickDataInfoExcept, deepCleanObject } = require("../utils");

class SubjectService {
  static async createSubject(subject) {
    return await SubjectRepository.createSubject(subject);
  }

  static async getSubject(subjectId) {
    return await SubjectRepository.getSubject(subjectId);
  }

  static async getSubjects(options) {
    return await SubjectRepository.getSubjects(options);
  }

  static async updateSubject({ subjectId, payload }) {
    const foundSub = await SubjectRepository.getSubject(subjectId);
    if (!foundSub) throw new NotFoundError("Can't find subject");

    const cleanedSubject = pickDataInfoExcept(deepCleanObject(payload), [
      "id",
      "createdAt",
      "updatedAt",
    ]);

    return await SubjectRepository.update(subjectId, cleanedSubject);
  }

  static async deleteSubject({ subjectId }) {
    return await SubjectRepository.delete(subjectId);
  }
}

module.exports = SubjectService;
