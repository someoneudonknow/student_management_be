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
