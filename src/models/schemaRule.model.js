"use strict";

const { DataTypes } = require("sequelize");
const { CLASS_MODEL_ID, STU_MODEL_ID } = require("../constants/schemaId");

const TABLE_NAME = "schema_rules";
const MODEL_NAME = "SchemaRule";

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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      schema_id: {
        unique: true,
        type: DataTypes.ENUM,
        allowNull: false,
        index: true,
        values: [CLASS_MODEL_ID, STU_MODEL_ID]
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      table_name: TABLE_NAME,
    },
  );
}
