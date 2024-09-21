"use strict"

const express = require("express")

const appRoutes = express.Router()

appRoutes.use("auth", require("./auth"))

module.exports = appRoutes
