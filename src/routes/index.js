"use strict";

const express = require("express");

const appRoutes = express.Router();

appRoutes.use("/v1/api/auth", require("./auth"));
appRoutes.use("/v1/api/students", require("./student"));
appRoutes.use("/v1/api/classes", require("./class"));
appRoutes.use("/v1/api/teachers", require("./teacher"));

module.exports = appRoutes;
