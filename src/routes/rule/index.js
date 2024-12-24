"use strict"

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/restrictTo.middleware");
const RuleController = require("../../controllers/rule.controller")

const routes = express.Router();

routes.use(authentication);
routes.use(restrictTo("admin"))

routes.post("/", asyncHandler(RuleController.createRule))
routes.get("/:schemaRuleId", asyncHandler(RuleController.getAllRules))
routes.delete("/:id", asyncHandler(RuleController.deleteRule))
routes.patch("/:id", asyncHandler(RuleController.updateRule))

module.exports = routes;
