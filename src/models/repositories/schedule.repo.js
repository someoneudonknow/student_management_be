const DB = require("../../db/mysql.init");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { InternalServerError } = require("../../cores/error.response");

class ScheduleRepository {
  static async createSchedules(schedules) {
    return await DB.Schedule.bulkCreate(schedules);
  }

  static async createSchedule(schedule) {
    return await DB.Schedule.create(schedule);
  }

  static async getSchedules(filter = {}, options) {
    return await DB.Schedule.findAll({
      where: filter,
      attributes: [
        "id",
        "day",
        "class",
        "section_order",
        "subject",
        "teacher",
        [
          sequelize.literal("(SELECT name FROM subjects WHERE subjects.id = schedule.subject)"),
          "name",
        ],
        [
          sequelize.literal("(SELECT name FROM classes WHERE classes.id = schedule.class)"),
          "class_name",
        ],
      ],
      order: [
        [
          sequelize.literal(
            "FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')",
          ),
          "ASC",
        ],
        ["section_order", "ASC"],
      ],
      ...options,
    });
  }

  static async getSchedule({ day, sectionOrder }) {
    return await DB.Schedule.findOne(
      { where: { day, section_order: sectionOrder } },
      { raw: true },
    );
  }

  static async getSchedulePerClass(classId, filter = {}, options) {
    return await DB.Schedule.findAll(
      {
        where: { class: classId, ...filter },
        order: [
          [
            sequelize.literal(
              "FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')",
            ),
            "ASC",
          ],
          ["section_order", "ASC"],
        ],
      },
      options,
    );
  }

  static async getScheduleExcludeClass(classId, filter = {}) {
    return await DB.Schedule.findAll({
      where: {
        class: { [Op.ne]: classId },
        ...filter,
      },
      order: [
        [sequelize.literal("(DAYOFWEEK(day) - 2) % 6"), "ASC"],
        ["section_order", "ASC"],
      ],
      raw: true,
    });
  }

  static async update(values, filters) {
    await DB.Schedule.update(values, { where: filters });
  }

  static async deleteSchedule(day, classId, sectionOrder) {
    await DB.Schedule.destroy({
      where: {
        day,
        section_order: sectionOrder,
        class: classId,
      },
    });
  }
}

module.exports = ScheduleRepository;
