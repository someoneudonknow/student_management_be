"use strict"

const {DataTypes} = require("sequelize");

const TABLE_NAME = "protector";
const MODEL_NAME = "Protector"

module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
        MODEL_NAME,
         {
            id:{

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
            gender: {
                type: DataTypes.ENUM,
                values: ["Male", "Female"],
                allowNull: false
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
            },
            // student_id: {
            //     type: DataTypes.UUID,
            //     allowNull: false,
            //     references: {
            //         model: "user",
            //         key: "id"
            //     }
            // }
         },
         {
            table_name: TABLE_NAME
         }
    )
}