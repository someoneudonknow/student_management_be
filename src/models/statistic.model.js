"use strict"

const { DataTypes } = require("sequelize");

const TABLE_NAME = "statistic"
const MODEL_NAME = "Statistic"

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
              semester: {
                type: DataTypes.ENUM("I", "II"),
                allowNull: false
              },
              year: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              pass_rate: {
                type: DataTypes.FLOAT,
              },
              pass_count: {
                type: DataTypes.INTEGER 
              }
        }, {
            table_name: TABLE_NAME
        }
    )
}