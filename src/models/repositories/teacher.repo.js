const { where, BelongsTo } = require("sequelize");
const DB = require("../../db/mysql.init");
const { BadRequestError } = require("../../cores/error.response");
const { raw } = require("express");

class TeacherRepository {
  static getTeacher = async (teacherId) => {
    return await DB.Teacher.findByPk(teacherId);
  };

  static getTeachers = async ({ page = 1, limit = 10, filter = {} }) => {
    const offset = (pageNum - 1) * limitNum;

    const data = await DB.Teacher.findAndCountAll({
      where: filter,
      offset,
      limit,
    });

    return { page, totalPages: Math.ceil(data.count / limit), list: data?.rows };
  };

  static getAllTeachers = async ({ page = 1, limit = 10 }) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const data = await DB.Teacher.findAndCountAll({
      offset,
      limit: limitNum,
      raw: true,
    });

    return { page: pageNum, totalPages: Math.ceil(data.count / limit), list: data?.rows };
  };

  static filterTeachersWithJoinAll = async (filters) => {
    if (!filters.limit) filters.limit = 25;
    if (!filters.offset) filters.offset = 0;

    const data = await DB.Teacher.findAndCountAll({
      include: [
        {
          model: DB.Subject,
          as: "address",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Teacher, DB.Subject, {
            targetKey: "id",
            foreignKey: "subject",
          }),
        },
      ],
      ...filters,
    });

    return {
      totalPages: parseInt(data.count / filters.limit),
      page: filters.offset / filters.limit + 1,
      list: data?.rows,
    };
  };

  static getAllTeachersWithJoinAll = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const data = await DB.Teacher.findAndCountAll({
      include: [
        {
          model: DB.Subject,
          as: "address",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Teacher, DB.Subject, {
            targetKey: "id",
            foreignKey: "subject",
          }),
        },
      ],
      offset: skip,
      limit,
    });

    return { totalPages: parseInt(data.count / limit), page, list: data?.rows };
  };

  static createTeacher = async (payload, options) => {
    return await DB.Teacher.create(payload, options);
  };

  static async deleteWithFilter(filter) {
    return await DB.Teacher.destroy(filter);
  }

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
