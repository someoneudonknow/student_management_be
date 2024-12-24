const { BadRequestError } = require("../cores/error.response");
const ClassRepository = require("../models/repositories/class.repo");
const { deepCleanObject, pickDataInfoExcept } = require("../utils");
const TeacherService = require("./teacher.service");

class ClassService {
  static getStudentInClass = async ({ classId }) => {
    const classFound = await ClassRepository.getClass(classId);
    if (!classFound) throw new BadRequestError("Class not found.");

    return await ClassRepository.getAllStudentsInClass(classId);
  };

  static getClass = async (classId) => {
    return await ClassRepository.getClassWithJoin(classId);
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
    const foundClass = await ClassRepository.getClass(classId);
    if (!foundClass) throw new BadRequestError("Class not found.");

    const classStudents = await ClassRepository.getAllStudentsInClass(classId);

    await Promise.all(classStudents.map(async stu => {
      stu.class = null
      console.log(stu)
      return await stu.save()
    }))

    return await ClassRepository.deleteClass(classId);
  };

  static updateClassManager = async ({ teacherId, classId, switchIfAlreadyManager = true }) => {
    const foundTeacher = await TeacherService.getTeacher(teacherId);
    if (!foundTeacher) throw new BadRequestError("Teacher not found");

    const newClass = await ClassRepository.getClass(classId);
    if (!newClass) throw new BadRequestError("Class not found.");

    const currentManagedClass = await ClassRepository.getClassByTeacherId(teacherId);

    if (currentManagedClass) {
      if (!switchIfAlreadyManager) {
        throw new BadRequestError("Teacher is already a manager of another class.");
      }

      await ClassRepository.updateClass(currentManagedClass.id, { class_manager: null });
    }

    return await ClassRepository.updateClassManager({ teacherId, classId });
  };
}

module.exports = ClassService;
