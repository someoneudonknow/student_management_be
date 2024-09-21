'use strict'

const { ConflictError } = require("../cores/error.response");
const UserRepo = require("../models/repositories/user.repo")

class AuthService {
  async login({ email, password }) {

  }

  async signUp({ email, password }) {
    const foundUser = await UserRepo.getUserByEmail(email)

    if (foundUser) {
      throw new ConflictError("Account already exists, would you like to login")
    }



  }

  async logout() {

  }
}

module.exports = AuthService;
