const { where } = require("sequelize");
const DB = require("../../db/mysql.init");
const { BadRequestError } = require("../../cores/error.response");

class TeacherRepository {
  static getTeacher = async (teacherId) => {
    return await DB.Teacher.findByPk(teacherId);
  };

  static getTeachers = async ({ page = 1, limit = 10, filter = {} }) => {
    const offset = (page - 1) * limit;
    const data = await DB.Teacher.findAndCountAll({
      where: filter,
      offset,
      limit,
    });

    return { page, totalPages: Math.ceil(data.count / limit), list: data?.rows };
  };

  static createTeacher = async (payload, options) => {
    return await DB.Teacher.create(payload, options);
  };

  static updateTeacher = async (teacherId, payload) => {
    const foundTeacher = await TeacherRepository.getTeacher(teacherId);
    if (!foundTeacher) throw new BadRequestError("Teacher not found");

    for (const field in payload) {
      foundTeacher[field] = payload[field];
    }

    return await foundTeacher.save();
  };

  static deleteTeacher = async (id) => {
    return await DB.Teacher.destroy({ where: { id } });
  };
}

module.exports = TeacherRepository;
