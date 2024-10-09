"use strict";

const { DataTypes, DATEONLY, FLOAT } = require("sequelize");

const TABLE_NAME = "score";
const MODEL_NAME = "Score";

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
      semester: {
        type: DataTypes.ENUM("I", "II"),
        allowNull: false,
      },
      school_year_start: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      school_year_end: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quarter_point_1: {
        type: DataTypes.FLOAT,
        validate: {
          pointValidate: function (value) {
            if (value < 0 || value > 10) throw new Error("Point must in range [0, 10]");
          },
        },
      },
      quarter_point_2: {
        type: DataTypes.FLOAT,
        validate: {
          pointValidate: function (value) {
            if (value < 0 || value > 10) throw new Error("Point must in range [0, 10]");
          },
        },
      },
      period_point: {
        type: DataTypes.FLOAT,
        validate: {
          pointValidate: function (value) {
            if (value < 0 || value > 10) throw new Error("Point must in range [0, 10]");
          },
        },
      },
      final_exam_point: {
        type: DataTypes.FLOAT,
        validate: {
          pointValidate: function (value) {
            if (value < 0 || value > 10) throw new Error("Point must in range [0, 10]");
          },
        },
      },
      AVG_point: {
        type: DataTypes.FLOAT,
        validate: {
          pointValidate: function (value) {
            if (value < 0 || value > 10) throw new Error("Point must in range [0, 10]");
          },
        },
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
    },
    {
      table_name: TABLE_NAME,
    },
  );
};
