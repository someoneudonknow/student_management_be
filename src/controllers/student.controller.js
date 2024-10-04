const { SuccessResponse } = require("../cores/success.response");
const StudentService = require("../services/student.service");

class StudentController {
  static createStudent = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create new student success",
      metadata: await StudentService.createStudent(req.body),
    }).send(res);
  };
}

module.exports = StudentController;
