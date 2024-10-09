"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "class";
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
        allowNull: false,
        validate: {
          sizeValidate: function (value) {
            if (value < 1) throw new Error("Size of class must more than 1");
          },
        },
      },
      grade: {
        type: DataTypes.ENUM("10", "11", "12"),
        allowNull: false,
      },
      class_manager: {
        type: DataTypes.UUID,
        unique: true,
      },
    },
    { table_name: TABLE_NAME },
  );
};
