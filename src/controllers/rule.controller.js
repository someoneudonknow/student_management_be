const { SuccessResponse } = require("../cores/success.response");
const RuleService = require("../services/rule.service")

class RuleController {
  static createRule = async (req, res, next) => {
    new SuccessResponse({
      message: "Create rule successfully",
      metadata: await RuleService.createRule(req.body)
    }).send(res)
  }

  static getAllRules = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all rules successfully",
      metadata: await RuleService.getAllRules({ schemaRuleId: req.params.schemaRuleId })
    }).send(res)
  }

  static deleteRule = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete rule successfully",
      metadata: await RuleService.deleteRule({ id: req.params.id })
    }).send(res)
  }

  static updateRule = async (req, res, next) => {
    new SuccessResponse({
      message: "Update rule successfully",
      metadata: await RuleService.updateRule({ id: req.params.id, body: req.body })
    }).send(res)
  }

  static getAllSchemaRules = async (req, res, next) => {
    new SuccessResponse({
      message: "Get schema rules successfully",
      metadata: await RuleService.getAllSchemaRules()
    }).send(res)
  }

  static createSchemaRule = async (req, res, next) => {
    new SuccessResponse({
      message: "Create schema rule successfully",
      metadata: await RuleService.createSchemaRule(req.body)
    }).send(res)
  }

  static deleteSchemaRule = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete schema rule successfully",
      metadata: await RuleService.deleteSchemaRule({ id: req.params.id })
    }).send(res)
  }

  static updateSchemaRule = async (req, res, next) => {
    new SuccessResponse({
      message: "Update schema rule successfully",
      metadata: await RuleService.updateSchemaRule({ id: req.params.id, body: req.body })
    }).send(res)
  }
}

module.exports = RuleController;
