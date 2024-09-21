"use strict"

const { DataTypes } = require("sequelize");
const { EMAIL } = require("../constants/regex");

const TABLE_NAME = "users"
const MODEL_NAME = "User"

module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    MODEL_NAME,
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          emailValidator: function(value) {
            if (!new RegExp(EMAIL).test(value)) {
              throw new Error("Invalid email patern")
            }
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type:DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        allowNull: false
      },
      class_role: {
        type: DataTypes.ENUM("leader", "student"),
        allowNull: false,
        defaultValue: "student"
      },
      // country_id: {
      //   type: DataTypes.UUID,
      //   references: {
      //     model: "address",
      //     key: "id"
      //   }
      // },
      // address_id: {
      //   type: DataTypes.UUID,
      //   references: {
      //     model: "address",
      //     key: "id"
      //   }
      // },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "student", "teacher"]
      }
    },
    {
      tableName: TABLE_NAME
    }
  );
}
