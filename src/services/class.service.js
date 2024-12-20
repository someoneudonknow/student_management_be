const { BadRequestError } = require("../cores/error.response");
const ClassRepository = require("../models/repositories/class.repo");
const { deepCleanObject, pickDataInfoExcept } = require("../utils");
const TeacherService = require("./teacher.service");

class ClassService {
  static getStudentInClass = async ({ classId }) => {
    const classFound = await ClassRepository.getClass(classId)
    if (!classFound) throw new BadRequestError("Class not found.")

    return await ClassRepository.getAllStudentsInClass(classId)
  }

  static getClass = async (classId) => {
    return await ClassRepository.getClass(classId);
  };

  static getClasses = async () => {
    return await ClassRepository.getAllClasses();
  };

  static createClass = async (payload) => {
    return await ClassRepository.createClass(pickDataInfoExcept(payload, ["size"]));
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

    const foundClass = await ClassRepository.getClassByTeacherId(teacherId);

    if (foundClass) throw new BadRequestError("Teacher had a class manager");

    return await ClassRepository.updateClassManager({ teacherId, classId });
  };
}

module.exports = ClassService;
