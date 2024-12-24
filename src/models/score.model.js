"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "scores";
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
      student: {
        type: DataTypes.UUID,
        references: {
          model: "students",
          key: "id",
        },
      },
      subject: {
        type: DataTypes.UUID,
        references: {
          model: "subjects",
          key: "id",
        },
      },
    },
    {
      tableName: TABLE_NAME,
      hooks: {
        beforeUpdate: async function (model) {
          console.log("model: ", model.quarter_point_1);
          const scoreFields = [
            "quarter_point_1",
            "quarter_point_2",
            "period_point",
            "final_exam_point",
          ];

          for (let field of scoreFields) {
            if (isNaN(model[field]) || model[field] < 0 || model[field] > 10) {
              return;
            } else {
              const calcAVGPoint =
                (model["final_exam_point"] * 3 +
                  model["period_point"] * 2 +
                  model["quarter_point_1"] +
                  model["quarter_point_1"]) /
                7;

              console.log("point: ", calcAVGPoint);

              model.AVG_point = Math.round(calcAVGPoint * 100) / 100;
            }

            console.log(model);
          }
        },
      },
    },
  );
};
