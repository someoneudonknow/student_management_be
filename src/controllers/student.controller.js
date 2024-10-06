const { SuccessResponse } = require("../cores/success.response");
const StudentService = require("../services/student.service");

class StudentController {
  static createStudent = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create new student success",
      metadata: await StudentService.createStudent(req.body),
    }).send(res);
  };

  static getStudent = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get student success",
      metadata: await StudentService.getStudent(req.params.studentId),
    }).send(res);
  };

  static getAllStudents = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get all students success",
      metadata: await StudentService.getAllStudents(req?.query),
    }).send(res);
  };

  //update using Patch method
  static updateStudent = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update student success",
      metadata: await StudentService.updateStudent({ id: req.params.studentId, update: req.body }),
    }).send(res);
  };

  static deleteStudent = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete student success",
      metadata: await StudentService.deleteStudent(req.params.studentId),
    }).send(res);
  };
}

module.exports = StudentController;
