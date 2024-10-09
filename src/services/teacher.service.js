const TeacherRepository = require("../models/repositories/teacher.repo");
const { deepCleanObject } = require("../utils");
const dateValidate = require("../helpers/dateValidate");
const { BadRequestError } = require("../cores/error.response");

class TeacherService {
  static getTeacher = async (teacherId) => {
    return await TeacherRepository.getTeacher(teacherId);
  };

  static getTeachers = async ({ page, limit }) => {
    return await TeacherRepository.getTeachers({ page, limit });
  };

  static createTeacher = async (payload) => {
    const hasFirstDayOfWork = payload.hasOwnProperty("first_day_of_work");

    if (hasFirstDayOfWork) {
      const firstDayOfWordValidate = dateValidate(
        payload["birthday"],
        payload["first_day_of_work"],
        18,
        40,
      );
      if (!firstDayOfWordValidate) throw new BadRequestError("Invalid date");
    }

    const hasBirthday = payload.hasOwnProperty("birthday");

    if (hasBirthday) {
      const ageValidate = dateValidate(payload["birthday"], new Date(), 18, 65);
      if (!ageValidate) throw new BadRequestError("Age must be in range [18, 65]");
    }

    return await TeacherRepository.createTeacher(payload);
  };

  static updateTeacher = async ({ teacherId, payload }) => {
    const hasUpdateBirthday = payload.hasOwnProperty("birthday");
    if (hasUpdateBirthday) {
      const ageValidate = dateValidate(payload["birthday"], new Date(), 18, 65);
      if (!ageValidate) throw new BadRequestError("Age must be in range [18, 65]");
    }

    const protectFields = ["id"];
    for (const field of protectFields) {
      delete payload[field];
    }
    const update = deepCleanObject(payload);

    return await TeacherRepository.updateTeacher(teacherId, update);
  };

  static deleteTeacher = async (teacherId) => {
    return await TeacherRepository.deleteTeacher(teacherId);
  };
}

module.exports = TeacherService;
