"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "rule";
const MODEL_NAME = "Rule";

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
      schema_rule_id: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
        index: true,
      },
      field: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field_type: {
        type: DataTypes.ENUM("NUMBER", "STRING", "BOOLEAN", "DECIMAL"),
        allowNull: false,
        default: "STRING"
      },
      operator: {
        type: DataTypes.ENUM("=", "!=", ">", "<", ">=", "<="),
        allowNull: false
      },
      compare_value: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      table_name: TABLE_NAME,
    },
  );
};
