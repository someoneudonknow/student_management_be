"use strict";

const { DataTypes } = require("sequelize");
const { EMAIL } = require("../constants/regex");

const TABLE_NAME = "students";
const MODEL_NAME = "Student";

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
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          emailValidator: function (value) {
            if (!new RegExp(EMAIL).test(value)) {
              throw new Error("Invalid email pattern");
            }
          },
        },
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        allowNull: false,
      },
      admission_day: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      class_role: {
        type: DataTypes.ENUM("leader", "student"),
        allowNull: false,
        defaultValue: "student",
      },
      country: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      class: {
        type: DataTypes.UUID,
      },
    },
    {
      tableName: TABLE_NAME,
      indexes: [
        {
          type: "FULLTEXT",
          name: "idx_search",
          fields: ["first_name", "last_name"],
        },
      ],
    },
  );
};
