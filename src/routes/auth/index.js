"use strict"

const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const AuthController = require("../../controllers/auth.controller")
const authentication = require("../../middlewares/auth.middleware")

const routes = express.Router()

routes.post("/signup", asyncHandler(AuthController.signUp))
routes.post("/login", asyncHandler(AuthController.login))
routes.post("/forgot-password", asyncHandler(AuthController.forgotPassword))
routes.post("/reset-password", asyncHandler(AuthController.resetPassword))

routes.use(authentication)

routes.post("/logout", asyncHandler(AuthController.logout))
routes.post("/refresh", asyncHandler(AuthController.refreshAToken))

module.exports = routes;
