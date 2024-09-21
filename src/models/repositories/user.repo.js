"use strict"

const DB = require("../../db/mysql.init")

const UserModel = DB.User

class UserRepository {
  static async getUserById(userId) {
    return await UserModel.findOne({
      id: userId
    })
  }

  static async getUserByEmail(email) {
    return await UserModel.findOne();
  }
}

module.exports = UserRepository
