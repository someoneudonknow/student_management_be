const { BadRequestError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { deepCleanObject } = require("../../utils");

class ClassRepository {
  static createClass = async (payload, options = {}) => {
    return await DB.Class.create(payload, options);
  };

  static getClassByTeacherId = async (teacherId) => {
    return await DB.Class.findOne({ where: { class_manager: teacherId } });
  };

  static getClass = async (classId, options) => {
    return await DB.Class.findByPk(classId, options);
  };

  static getClasses = async ({ page = 1, limit = 10, filter }) => {
    const offset = (page - 1) * limit;
    const data = await DB.Class.findAndCountAll({
      where: filter,
      offset,
      limit,
    });

    console.log(data);

    return { page, totalPages: Math.ceil(data.count / limit), list: data?.rows };
  };

  static updateClass = async (classId, update) => {
    const foundClass = await ClassRepository.getClass(classId);

    if (!foundClass) throw new BadRequestError("Class not found");

    for (const field in update) {
      foundClass[field] = update[field];
    }
    return await foundClass.save();
  };

  static deleteClass = async (classId) => {
    return await DB.Class.destroy({
      where: {
        id: classId,
      },
    });
  };

  static updateClassManager = async ({ teacherId, classId }) => {
    return await DB.Class.update(
      {
        class_manager: `${teacherId}`,
      },
      {
        where: {
          id: classId,
        },
      },
    );
  };
}

module.exports = ClassRepository;
