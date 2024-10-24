"use strict"

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/restrictTo.middleware");
const RuleController = require("../../controllers/rule.controller")

const routes = express.Router();

routes.use(authentication);
routes.use(restrictTo("admin"))

routes.post("/", asyncHandler(RuleController.createSchemaRule))
routes.get("/", asyncHandler(RuleController.getAllSchemaRules))
routes.delete("/:id", asyncHandler(RuleController.deleteSchemaRule))
routes.patch("/:id", asyncHandler(RuleController.updateSchemaRule))

module.exports = routes;
