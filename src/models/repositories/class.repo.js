const DB = require("../../db/mysql.init");

class ClassRepository {
  static createClass = async (payload, options = {}) => {
    return await DB.Class.create(payload, options);
  };

  static getClass = async (classId, options) => {
    return await DB.Class.findByPk(classId, options);
  };

  static getAllClasses = async ({ page = 1, limit = 10, filter }) => {
    const offset = (page - 1) * limit;
    return await DB.Class.findAndCountAll({
      where: filter,
      offset,
      limit,
    });
  };

  static updateClass = async (classId, update) => {
    const foundClass = await ClassRepository.getClass(classId);
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
}

module.exports = ClassRepository;
