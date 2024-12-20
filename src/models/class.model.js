"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "classes";
const MODEL_NAME = "Class";

module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    MODEL_NAME,
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      grade: {
        type: DataTypes.ENUM("10", "11", "12"),
        allowNull: false,
      },
      class_manager: {
        type: DataTypes.UUID,
        references: {
          model: "teachers",
          key: "id",
        },
      },
      class_leader: {
        type: DataTypes.UUID,
        references: {
          model: "students",
          key: "id",
        },
      },
    },
    { tableName: TABLE_NAME },
  );
};
