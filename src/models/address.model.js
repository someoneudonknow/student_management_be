"use strict"

const {DataTypes} = require("sequelize");

const TABLE_NAME = "address";
const MODEL_NAME = "Address";

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
            number: {
                type: DataTypes.STRING,
            },
            street: {
                type: DataTypes.STRING,
            },
            district: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            table_name: TABLE_NAME
        }
    )
}