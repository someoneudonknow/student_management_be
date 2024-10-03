"use strict"

const { DataTypes } = require("sequelize")

const TABLE_NAME = "class"
const MODEL_NAME = "Class"

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
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      grade: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      // class_manager: {
      //     type: DataTypes.UUID,
      //     allowNull: false,
      //     unique: true,
      //     reference: {
      //         model: "teacher",
      //         key: "id"
      //     }
      // }
    },
    { table_name: TABLE_NAME }
  )
}
