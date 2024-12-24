"use strict";

const {DataTypes} = require("sequelize");

const TABLE_NAME = "rules";
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
            schema_rule: {
                type: DataTypes.UUID,
                references: {
                    model: "schema_rules",
                    key: "id",
                },
            },
            field: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            field_type: {
                type: DataTypes.ENUM("NUMBER", "STRING", "BOOLEAN", "DECIMAL"),
                allowNull: false,
                default: "STRING",
            },
            operator: {
                type: DataTypes.ENUM("=", "!=", ">", "<", ">=", "<="),
                allowNull: false,
            },
            compare_value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: TABLE_NAME,
        },
    );
};
