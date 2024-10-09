"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "statistic";
const MODEL_NAME = "Statistic";

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
      semester: {
        type: DataTypes.ENUM("I", "II"),
        allowNull: false,
      },
      school_year_start: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      school_year_end: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pass_rate: {
        type: DataTypes.FLOAT,
        validate: {
          passRateValidate: function (value) {
            if (value < 0 || value > 100) throw new Error("Pass rate must in range [0, 100]");
          },
        },
      },
      pass_count: {
        type: DataTypes.INTEGER,
      },
    },
    {
      table_name: TABLE_NAME,
    },
  );
};
