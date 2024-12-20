"use strict";

const {DataTypes} = require("sequelize");

const TABLE_NAME = "schedules";
const MODEL_NAME = "Schedule";

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
      class: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "classes",
          key: "id",
        },
      },
      day: {
        type: DataTypes.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ),
        allowNull: false,
      },
      section_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
      },
      teacher: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "teachers",
          key: "id",
        },
      },
    },
    {
      table_name: TABLE_NAME,
    },
  );
};
