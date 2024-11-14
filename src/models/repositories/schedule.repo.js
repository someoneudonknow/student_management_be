const DB = require("../../db/mysql.init")

class ScheduleRepository {
    static async createSchedules(schedules) {
        return await DB.Schedule.bulkCreate(schedules)
    }

    static async getSchedules(options) {
        return await DB.Schedule.findAll(options)
    }
}

module.exports = ScheduleRepository