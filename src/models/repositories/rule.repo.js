"use strict"

const { InternalServerError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { deepCleanObject, pickDataInfo, pickDataInfoExcept } = require("../../utils");

class RuleRepository {
  static getSchemaRuleById = async (id) => {
    return await DB.SchemaRule.findByPk(id)
  }

  static getSchemaRuleBySchemaId = async (id) => {
    return await DB.SchemaRule.findOne({
      where: {
        schema_id: id
      }
    })
  }

  static getAllRulesBySchemaRuleId = async ({ schemaRuleId }) => {
    if (!schemaRuleId) throw new InternalServerError("Something went wrong.")

    return await DB.Rule.findAll({
      where: {
        schema_rule_id: schemaRuleId
      }
    })
  }

  static updateSchemaRule = async ({ id, body }) => {
    const foundSchemaRule = await DB.SchemaRule.findByPk(id)
    if (!foundSchemaRule) throw new InternalServerError("Something went wrong")

    const allowedFields = ["name", "description"]
    const cleanedBody = deepCleanObject(pickDataInfo(body, allowedFields))

    for (const field in cleanedBody) {
      foundSchemaRule[field] = cleanedBody[field]
    }

    return await foundSchemaRule.save()
  }

  static updateRule = async ({ id, body }) => {
    const foundRule = await DB.Rule.findByPk(id)
    if (!foundRule) throw new InternalServerError("Something went wrong")

    const unAllowedFields = ["id"]
    const cleanedBody = deepCleanObject(pickDataInfoExcept(body, unAllowedFields))

    for (const field in cleanedBody) {
      foundRule[field] = cleanedBody[field]
    }

    return await foundRule.save()
  }

  static getAllSchemaRules = async () => {
    return await DB.SchemaRule.findAll({})
  }

  static createRule = async (body) => {
    return await DB.Rule.create(body)
  }

  static createSchemaRule = async (body) => {
    return await DB.SchemaRule.create(body)
  }

  static deleteSchemaRule = async ({ id }) => {
    return await DB.SchemaRule.destroy({
      where: {
        id
      }
    })
  }

  static deleteRule = async ({ id }) => {
    return await DB.Rule.destroy({
      where: {
        id
      }
    })
  }
}

module.exports = RuleRepository;
