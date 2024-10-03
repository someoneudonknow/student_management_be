'use strict'

const bcrypt = require("bcryptjs")
const { app: { pepper }, clientUrl } = require("../configs/app.config")
const { ConflictError, InternalServerError, BadRequestError, AuthFailureError, ForbiddenError } = require("../cores/error.response");
const UserRepo = require("../models/repositories/user.repo")
const KeyTokenService = require("./keyToken.service");
const { Op } = require("sequelize");
const UserRepository = require("../models/repositories/user.repo");
const { sendMail } = require("./mail.service");
const verifyTemplate = require("../templates/verifyEmail.template");
const OTPService = require("./otp.service");

class AuthService {
  static async resetPassword({ otp, uid, newPassword }) {
    const foundUser = await UserRepo.getUserById(uid)

    if (!foundUser) throw new BadRequestError("You're not register")

    const isValidOTP = await OTPService.verifyOTP({ otp, userId: foundUser.id })
    if (!isValidOTP) throw new BadRequestError("You're otp is expired or invalid")

    if (!newPassword) throw new BadRequestError("Invalid password")

    const hashedPassword = await this.getPasswordHash(newPassword)

    await UserRepo.updateUserById(foundUser.id, { password: hashedPassword })

    return null
  }

  static async forgotPassword({ email }) {
    const foundUser = await UserRepo.getUserByEmail(email)
    if (!foundUser) throw new BadRequestError("You're not register")

    const TIMEOUT = 3;

    const createdOTP = await OTPService.createOTP({ userId: foundUser.id, timeoutInMinutes: TIMEOUT })

    await sendMail({
      from: "Tran Tu <nguyentu550278@gmail.com",
      to: email,
      subject: "This is your verification email, please don't share this to anyone",
      html: verifyTemplate({ expirationTime: TIMEOUT, verifyLink: `${clientUrl}/reset-password?otp=${createdOTP}&uid=${foundUser.id}` })
    })

    return null;
  }

  static async refreshAToken({ user, refreshToken, userToken }) {
    if (!refreshToken) throw new BadRequestError("Please provide a refresh token")

    const { id, user_email } = user
    const { publicKey, refreshToken: { token }, refreshTokenUsed, privateKey } = userToken

    if (refreshTokenUsed.findIndex(rft => rft === refreshToken) !== -1) {
      await KeyTokenService.deleteToken({ userId: id })

      throw new ForbiddenError("There're some suspicious behavior of your account! please log in again")
    }

    if (token !== refreshToken) {
      throw new AuthFailureError("You're not register")
    }

    const foundUser = await UserRepository.getUserByEmail(user_email)
    if (!foundUser) throw new AuthFailureError("You're not register")

    const newTokenPairs = await KeyTokenService.createTokenPair({ payload: { id: foundUser.id, user_email: foundUser.email, user_name: foundUser.user_name }, publicKey, privateKey })

    const updatedTokenData = {
      ...userToken,
      userId: id,
      refreshTokenUsed: [...refreshTokenUsed, refreshToken],
      refreshToken: newTokenPairs.refreshToken
    }

    await KeyTokenService.createKeyToken(updatedTokenData)

    return {
      user: foundUser.toJSON(),
      tokens: newTokenPairs
    }
  }

  static async logout({ userId }) {
    const result = await KeyTokenService.deleteToken({ userId: userId })

    if (result !== 1) throw new AuthFailureError("Could not logout")

    return null
  }

  static async login({ identifier, password }) {
    const foundUser = await UserRepo.getUser({
      where: {
        [Op.or]: [
          { email: identifier },
          { user_name: identifier },
        ]
      }
    })

    if (!foundUser) throw new BadRequestError("Account not found")

    const isPassCorrect = await bcrypt.compare(password, foundUser.password)

    if (!isPassCorrect) throw new AuthFailureError("Wrong password or user name")

    const { id, email: user_email, user_name } = foundUser
    const { privateKey, publicKey } = await KeyTokenService.createKeyPairs()
    const tokens = await KeyTokenService.createTokenPair({ payload: { id, user_email, user_name }, publicKey, privateKey })
    const createResult = await KeyTokenService.createKeyToken({ userId: id, publicKey, refreshToken: tokens.refreshToken, privateKey })

    if (createResult !== "OK") throw new InternalServerError("Something went wrong while creating tokens")

    return {
      user: foundUser,
      tokens
    }
  }

  static async signUp({ email, password, userName }) {
    const foundUser = await UserRepo.getUserByEmail(email)

    if (foundUser) {
      throw new ConflictError("Account already exists!")
    }

    const passwordHashed = await AuthService.getPasswordHash(password)

    const newUser = await UserRepo.createUser({ email, user_name: userName, password: passwordHashed, role: "admin" })

    if (!newUser) throw new InternalServerError("Something when wrong while creating user")

    const { id, email: user_email, user_name } = newUser
    const { privateKey, publicKey } = await KeyTokenService.createKeyPairs()
    const tokens = await KeyTokenService.createTokenPair({ payload: { id, user_email, user_name }, publicKey, privateKey })
    const createResult = await KeyTokenService.createKeyToken({ userId: id, publicKey, refreshToken: tokens.refreshToken, privateKey })

    if (createResult !== "OK") throw new InternalServerError("Something went wrong while creating tokens")

    return {
      user: newUser,
      tokens
    }
  }

  static async getPasswordHash(password) {
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const passwordHashed = await bcrypt.hash(password, salt + pepper)

    return passwordHashed
  }
}

module.exports = AuthService;
