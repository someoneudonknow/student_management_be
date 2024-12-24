const SubjectService = require("../services/subject.service");
const { SuccessResponse } = require("../cores/success.response");

class SubjectController {
  static deleteSubject = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete subjects successfully",
      metadata: await SubjectService.deleteSubject({
        subjectId: req.params.subjectId,
      }),
    }).send(res);
  };

  static updateSubject = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update subjects successfully",
      metadata: await SubjectService.updateSubject({
        subjectId: req.params.subjectId,
        payload: req.body,
      }),
    }).send(res);
  };

  static createSubject = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create subject successfully",
      metadata: await SubjectService.createSubject(req.body),
    }).send(res);
  };

  static getSubjects = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get subjects successfully",
      metadata: await SubjectService.getSubjects(),
    }).send(res);
  };
}

module.exports = SubjectController;
