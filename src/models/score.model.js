"use strict"

const { DataTypes, DATEONLY, FLOAT } = require("sequelize");

const TABLE_NAME = "score"
const MODEL_NAME = "Score"

module.exports =(sequelize, Sequelize) => {
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
              quarter_point_1: {
                type: DataTypes.FLOAT,
                //limit range
              },
              quarter_point_2: {
                type: DataTypes.FLOAT,
                //limit range
              },
              period_point: {
                type: DataTypes.FLOAT
              },
              final_exam_point: {
                type: DataTypes.FLOAT
              },
              AVG_point: {
                type: DataTypes.FLOAT
              },
              // student_id: {
              //   type: DataTypes.UUID,
              //   allowNull: false,
              //   references: {
              //     model: "user",
              //     key: "id"
              //   }
              // },
              // subject_id: {
              //   type: DataTypes.UUID,
              //   allowNull: false,
              //   references: {
              //     model: "subject",
              //     key: "id"
              //   }
              // }
        }, {
            table_name: TABLE_NAME
        }
    )
}