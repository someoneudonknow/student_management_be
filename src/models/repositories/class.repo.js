const { BelongsTo } = require("sequelize");
const { BadRequestError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { getAllTeachersWithJoinAll } = require("./teacher.repo");
const { pickDataInfoExcept } = require("../../utils");

class ClassRepository {
  static createClass = async (payload, options = {}) => {
    return await DB.Class.create(payload, options);
  };

  static getClassByTeacherId = async (teacherId) => {
    return await DB.Class.findOne({ where: { class_manager: teacherId } });
  };

  static getClass = async (classId, options = {}) => {
    return await DB.Class.findByPk(classId, options);
  };

  static getClassWithJoin = async (classId) => {
    let classFound = await DB.Class.findOne({
      where: {
        id: classId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [
        ["grade", "ASC"],
        ["name", "ASC"],
      ],
      include: [
        {
          model: DB.Teacher,
          as: "class_manager",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Class, DB.Teacher, {
            targetKey: "id",
            foreignKey: "class_manager",
          }),
        },
        {
          model: DB.Student,
          as: "class_leader",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Class, DB.Student, {
            targetKey: "id",
            foreignKey: "class_leader",
          }),
        },
      ],
    });

    classFound = classFound?.toJSON();

    classFound.class_manager = classFound?.Teacher;
    classFound.class_leader = classFound?.Student;

    delete classFound.Teacher;
    delete classFound.Student;

    return classFound;
  };

  static getAllClasses = async () => {
    const result = await DB.Class.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [
        ["grade", "ASC"],
        ["name", "ASC"],
      ],
      include: [
        {
          model: DB.Teacher,
          as: "class_manager",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Class, DB.Teacher, {
            targetKey: "id",
            foreignKey: "class_manager",
          }),
        },
        {
          model: DB.Student,
          as: "class_leader",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Class, DB.Student, {
            targetKey: "id",
            foreignKey: "class_leader",
          }),
        },
      ],
    });

    const classes = result.map((r) => {
      return {
        ...r.toJSON(),
        class_manager: r?.Teacher?.toJSON(),
        class_leader: r?.Student?.toJSON(),
      };
    });

    return classes.map((c) => pickDataInfoExcept(c, ["", ""]));
  };

  static getAllStudentsInClass = async (classId) => {
    return DB.Student.findAll({
      where: {
        class: classId,
      },
      include: [
        {
          model: DB.Address,
          as: "address",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          association: new BelongsTo(DB.Student, DB.Address, {
            targetKey: "id",
            foreignKey: "address",
          }),
        },
      ],
    });
  };

  static getClasses = async ({ page = 1, limit = 10, filter }) => {
    const offset = (page - 1) * limit;
    const data = await DB.Class.findAndCountAll({
      where: filter,
      offset,
      limit,
    });

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

  static increaseClassSize = async (classId, by = 1) => {
    const classFound = await DB.Class.findByPk(classId);
    if (!classFound) throw new BadRequestError("Class not found");

    return await classFound.increment("size", { by });
  };

  static decreaseClassSize = async (classId, by = 1) => {
    const classFound = await DB.Class.findByPk(classId);
    if (!classFound) throw new BadRequestError("Class not found");

    return await classFound.decrement("size", { by });
  };
}

module.exports = ClassRepository;
