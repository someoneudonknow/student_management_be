"use strict";

const { DataTypes } = require("sequelize");

const TABLE_NAME = "schedule";
const MODEL_NAME = "Schedule";

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
            class: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            day: {
                type: DataTypes.ENUM("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"),
                allowNull: false,
            },
            section_order: {
                //can be set min max for particular case
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            subject: {
                type: DataTypes.UUID,
                allowNull: false,
            }
        },
        {
            table_name: TABLE_NAME,
        },
    );
};
