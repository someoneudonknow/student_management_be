"use strict"

const express = require("express")

const appRoutes = express.Router()

appRoutes.use("/v1/api/auth", require("./auth"))

module.exports = appRoutes
