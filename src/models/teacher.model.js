"use strict";

const { DataTypes } = require("sequelize");
const { PHONE_NUMBER, EMAIL } = require("../constants/regex");
const dateValidate = require("../helpers/dateValidate");

const TABLE_NAME = "teacher";
const MODEL_NAME = "Teacher";

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
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
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
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          birthdayValidate: function (value) {
            const birthday = new Date(value);
            const dayValidate = dateValidate(birthday, new Date(), 18, 65);

            if (!dayValidate) throw new Error("Teacher age must in range [18, 65]");
          },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          phoneNumberValidation: function (value) {
            if (!new RegExp(PHONE_NUMBER).test(value)) throw new Error("Invalid phone number");
          },
          phoneNumberLength: function (value) {
            if (value.length !== 10) throw new Error("Phone number must has 10 digits");
          },
        },
      },
      first_day_of_work: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_retired: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      // group_id: {
      //     type: DataTypes.UUID,
      //     allowNull: false,
      //     references: {
      //         model: "group",
      //         key: "id"
      //     }
      // }
    },
    {
      table_name: TABLE_NAME,
    },
  );
};
