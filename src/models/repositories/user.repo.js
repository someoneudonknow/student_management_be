"use strict"

const { BadRequestError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { pickDataInfo, deepCleanObject } = require("../../utils");

class UserRepository {
  static async getUser(filter, options) {
    return await DB.User.findOne(filter, options)
  }

  static async getUserById(userId, options) {
    return await DB.User.findByPk(userId, options)
  }

  static async getUserByEmail(email, options) {
    return await DB.User.findOne({
      where: {
        email
      }
    }, options);
  }

  static async createUser(payload, options) {
    return await DB.User.create(payload, options)
  }

  static async updateUserById(id, payload) {
    const foundUser = await this.getUserById(id)
    if (!foundUser) throw new BadRequestError("User not found")

    const allowedFields = ["user_name", "email", "password"]
    const cleanedData = pickDataInfo(deepCleanObject(payload), allowedFields)
    const updateFields = Object.keys(cleanedData)

    for (const field of updateFields) {
      foundUser[field] = cleanedData[field]
    }

    return await foundUser.save()
  }
}

module.exports = UserRepository
