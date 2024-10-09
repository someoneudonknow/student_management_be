const ClassRepository = require("../models/repositories/class.repo");
const { deepCleanObject } = require("../utils");

class ClassService {
  static getClass = async (classId) => {
    return await ClassRepository.getClass(classId);
  };

  static getClasses = async ({ page, limit, ...rest }) => {
    return await ClassRepository.getClasses({ page, limit, filter: rest });
  };

  static createClass = async (payload) => {
    return await ClassRepository.createClass(payload);
  };

  static updateClass = async ({ classId, update }) => { 
    const protectFields = ["id"];
    for (const field in protectFields) {
      delete update[field];
    }
    const payload = deepCleanObject(update);
    return await ClassRepository.updateClass(classId, payload);
  };

  static deleteClass = async (classId) => {
    return await ClassRepository.deleteClass(classId);
  };
}

module.exports = ClassService;
