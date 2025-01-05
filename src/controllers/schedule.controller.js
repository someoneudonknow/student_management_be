const ScheduleService = require("../services/schedule.service");
const { SuccessResponse } = require("../cores/success.response");

class ScheduleController {
  // static createSchedules = async (req, res, next) => {
  //   return new SuccessResponse({
  //     message: "Create schedule success",
  //     metadata: await ScheduleService.createSchedules(req.body),
  //   }).send(res);
  // };

  static checkSchedule = async (req, res, next) => {
    return new SuccessResponse({
      message: "Valid schedule",
      metadata: await ScheduleService.checkDuplicate(req.body),
    }).send(res);
  };

  static getSchedules = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get schedules success",
      metadata: await ScheduleService.getSchedules(),
    }).send(res);
  };

  static getTeacherSchedules = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get teacher schedule success",
      metadata: await ScheduleService.getTeacherSchedules(),
    }).send(res);
  };

  static getNonTeacherSchedule = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get non teacher schedule success",
      metadata: await ScheduleService.getNonTeacherSchedule(),
    }).send(res);
  };

  static getSchedulePerClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get schedule per class success",
      metadata: await ScheduleService.getSchedulePerClass(req.params.classId),
    }).send(res);
  };

  static checkTeacherSchedule = async (req, res, next) => {
    return new SuccessResponse({
      message: "Scheduling teacher for class success",
      metadata: await ScheduleService.checkTeacherSchedule(req.body),
    }).send(res);
  };

  static teacherSchedules = async (req, res, next) => {
    return new SuccessResponse({
      message: "Teacher scheduling success",
      metadata: await ScheduleService.teacherSchedules(),
    }).send(res);
  };
}

module.exports = ScheduleController;
