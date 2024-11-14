"use strict";

const express = require("express");

const appRoutes = express.Router();

appRoutes.use("/v1/api/auth", require("./auth"));
appRoutes.use("/v1/api/students", require("./student"));
appRoutes.use("/v1/api/classes", require("./class"));
appRoutes.use("/v1/api/teachers", require("./teacher"));
appRoutes.use("/v1/api/rules", require("./rule"))
appRoutes.use("/v1/api/schema-rules", require("./schemaRule"))
appRoutes.use("/v1/api/scores", require("./score"));
appRoutes.use("/v1/api/schedules", require("./schedule"));
appRoutes.use("/v1/api/subjects", require("./subject"));

module.exports = appRoutes;
