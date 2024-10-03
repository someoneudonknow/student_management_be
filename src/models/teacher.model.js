"use strict"

const { DataTypes } = require("sequelize");

const TABLE_NAME = "teacher"
const MODEL_NAME = "Teacher"

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
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      birthday: {
        type: DataTypes.DATE
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      first_day_of_work: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
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
      table_name: TABLE_NAME
    }
  )
}
