"use strict";

const express = require("express");

const appRoutes = express.Router();

appRoutes.use("/v1/api/auth", require("./auth"));
appRoutes.use("/v1/api/students", require("./student"));

module.exports = appRoutes;
