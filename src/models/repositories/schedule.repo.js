const DB = require("../../db/mysql.init");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

class ScheduleRepository {
  static async createSchedules(schedules) {
    return await DB.Schedule.bulkCreate(schedules);
  }

  static async createSchedule(schedule) {
    return await DB.Schedule.create(schedule);
  }

  static async getSchedules(options) {
    return await DB.Schedule.findAll({
      attributes: [
        "id",
        "day",
        "class_id",
        "section_order",
        "subject",
        [
          sequelize.literal("(SELECT name FROM Subjects WHERE Subjects.id = Schedule.subject)"),
          "name",
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
      raw: true,
    });
  }

  static async getSchedule({ day, sectionOrder }) {
    return await DB.Schedule.findOne({ where: { day, sectionOrder } }, { raw: true });
  }

  static async getSchedulePerClass(classId, options) {
    return await DB.Schedule.findAll(
      {
        where: { class_id: classId },
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

  static async getScheduleExcludeClass(classId) {
    return await DB.Schedule.findAll(
      {
        where: {
          class_id: { [Op.ne]: classId },
        },
        order: [
          [sequelize.literal("(DAYOFWEEK(day) - 2) % 6"), "ASC"],
          ["section_order", "ASC"],
        ],
      },
      { raw: true },
    );
  }

  static async deleteSchedule(day, classId, sectionOrder) {
    await DB.Schedule.destroy({
      where: {
        day,
        section_order: sectionOrder,
        class_id: classId,
      },
    });
  }
}

module.exports = ScheduleRepository;
