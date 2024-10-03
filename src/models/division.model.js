"use strict"

const { DataTypes, STRING } = require("sequelize");

const TABLE_NAME = "divisions"
const MODEL_NAME = "Division"

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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      table_name: TABLE_NAME
    }
  )
}
