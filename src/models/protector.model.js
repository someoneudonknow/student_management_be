"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "protector";
const MODEL_NAME = "Protector";

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
      gender: {
        type: DataTypes.ENUM,
        values: ["Male", "Female"],
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          phoneNumberValidation: function (value) {
            if (!new RegExp(PHONE_NUMBER).test(value)) throw new Error("Invalid phone number");
          },
          phoneNumberLength: function (value) {
            if (value.length !== 10) throw new Error("Phone number must has 10 digits");
          },
        },
      },
      role: {
        type: DataTypes.STRING,
      },
      // student_id: {
      //     type: DataTypes.UUID,
      //     allowNull: false,
      //     references: {
      //         model: "user",
      //         key: "id"
      //     }
      // }
    },
    {
      table_name: TABLE_NAME,
    },
  );
};
