const TeacherService = require("../services/teacher.service");
const { SuccessResponse } = require("../cores/success.response");

class TeacherController {
  static getTeacher = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get teacher success",
      metadata: await TeacherService.getTeacher(req.params.teacherId),
    }).send(res);
  };

  static getTeachers = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get teachers success",
      metadata: await TeacherService.getTeachers(req?.query),
    }).send(res);
  };

  static createTeacher = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create teacher success",
      metadata: await TeacherService.createTeacher(req.body),
    }).send(res);
  };

  static updateTeacher = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update teacher success",
      metadata: await TeacherService.updateTeacher({
        teacherId: req.params.teacherId,
        payload: req.body,
      }),
    }).send(res);
  };

  static deleteTeacher = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete teacher success",
      metadata: await TeacherService.deleteTeacher(req.params.teacherId),
    }).send(res);
  };
}

module.exports = TeacherController;
