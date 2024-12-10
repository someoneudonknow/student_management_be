"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "subjects";
const MODEL_NAME = "Subject";

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
      number_of_period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          numberOfPeriodValidate: function (value) {
            if (value < 1) throw new Error("Number of period must more than 0");
          },
        },
      },
    },
    {
      tableName: TABLE_NAME,
    },
  );
};
