const { BadRequestError } = require("../cores/error.response");
const ClassRepository = require("../models/repositories/class.repo");
const { deepCleanObject } = require("../utils");
const TeacherService = require("./teacher.service");

class ClassService {
  static getClass = async (classId) => {
    return await ClassRepository.getClass(classId);
  };

  static getClasses = async ({ page, limit, ...rest }) => {
    return await ClassRepository.getClasses({ page, limit, filter: rest });
  };

  static createClass = async (payload) => {
    return await ClassRepository.createClass(payload);
  };

  static updateClass = async ({ classId, update }) => {
    const protectFields = ["id"];
    for (const field in protectFields) {
      delete update[field];
    }
    const payload = deepCleanObject(update);
    return await ClassRepository.updateClass(classId, payload);
  };

  static deleteClass = async (classId) => {
    return await ClassRepository.deleteClass(classId);
  };

  static updateClassManager = async ({ teacherId, classId }) => {
    const foundTeacher = await TeacherService.getTeacher(teacherId);
    if (!foundTeacher) throw new BadRequestError("Teacher not found");

    console.log("teacher id", teacherId)
    const foundClass = await ClassRepository.getClassByTeacherId(teacherId);
    console.log("found class", foundClass);
    if (foundClass) throw new BadRequestError("Teacher had a class manager");

    return await ClassRepository.updateClassManager({ teacherId, classId });
  };
}

module.exports = ClassService;
