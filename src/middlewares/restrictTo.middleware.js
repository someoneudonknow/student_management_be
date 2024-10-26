"use strict"

const { BadRequestError, ForbiddenError, AuthFailureError } = require("../cores/error.response");
const UserRepository = require("../models/repositories/user.repo")

const restrictTo = (roles) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    if (!userId) throw new BadRequestError("User not register")

    const foundUser = await UserRepository.getUserById(userId)
    if (!foundUser) throw new BadRequestError("User not register")

    if (roles && roles.length > 0 && !roles.includes(foundUser.role)) {
      throw new AuthFailureError("You're not allowed to do this.")
    }

    next()
  }
}

module.exports = restrictTo;
