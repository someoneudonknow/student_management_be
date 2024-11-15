const ScheduleService = require("../services/schedule.service");
const {SuccessResponse} = require("../cores/success.response");

class ScheduleController {
    static createSchedules = async (req, res, next) => {
        return new SuccessResponse({
            message: "Create schedule success",
            metadata: await ScheduleService.createSchedules(req.body)
        }).send(res)
    }

    static checkSchedule = async (req, res, next) => {
        return new SuccessResponse({
            message: "Valid schedule",
            metadata: await ScheduleService.checkDuplicate(req.body)
        }).send(res);
    }

    static getSchedules = async (req, res, next) => {
        return new SuccessResponse({
            message: "Get schedules success",
            metadata: await ScheduleService.getSchedules()
        }).send(res)
    }

    static removeCache = async (req, res, next) => {
        return new SuccessResponse({
            message: "Remove schedule success",
            metadata: await ScheduleService.removeCache()
        }).send(res)
    }
}

module.exports = ScheduleController;