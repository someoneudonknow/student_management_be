"use strict"

const { SuccessResponse, Created } = require("../cores/success.response.js")
const AuthService = require("../services/auth.service.js")

class AuthController {
  static resetPassword = async (req, res, next) => {
    new SuccessResponse({
      message: "Successfully reset your password",
      metadata: await AuthService.resetPassword({
        otp: req.body.otp,
        newPassword: req.body.password,
        uid: req.body.id
      })
    }).send(res)
  }

  static forgotPassword = async (req, res, next) => {
    new SuccessResponse({
      message: "We have sent you a verification link, please check your email",
      metadata: await AuthService.forgotPassword({
        email: req.body.email
      })
    }).send(res)
  }

  static refreshAToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Refresh token successfully",
      metadata: await AuthService.refreshAToken({
        user: req.user,
        userToken: req.userToken,
        refreshToken: req.refreshToken
      })
    }).send(res)
  }

  static logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AuthService.logout({
        userId: req.user.id
      })
    }).send(res)
  }

  static signUp = async (req, res, next) => {
    new Created({
      message: "Sign up successfully",
      metadata: await AuthService.signUp(req.body)
    }).send(res)
  }

  static login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AuthService.login(req.body)
    }).send(res)
  }
}

module.exports = AuthController;
