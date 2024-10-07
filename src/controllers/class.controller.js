const ClassService = require("../services/class.service");
const { SuccessResponse } = require("../cores/success.response");

class ClassController {
  static createClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create class success",
      metadata: await ClassService.createClass(req.body),
    }).send(res);
  };

  static getClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get class success",
      metadata: await ClassService.getClass(req.params.classId),
    }).send(res);
  };

  static getClasses = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get classes success",
      metadata: await ClassService.getAllClasses(req?.query),
    }).send(res);
  };

  static updateClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update class success",
      metadata: await ClassService.updateClass({ classId: req.params.classId, update: req.body }),
    }).send(res);
  };

  static deleteClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete class success",
      metadata: await ClassService.deleteClass(req.params.classId),
    }).send(res);
  };
}

module.exports = ClassController;
