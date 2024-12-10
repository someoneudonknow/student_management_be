"use strict";

const { STU_MODEL_ID, CLASS_MODEL_ID } = require("../constants/schemaId");
const { BadRequestError, ConflictError } = require("../cores/error.response");
const RuleRepository = require("../models/repositories/rule.repo");

const SCHEMA_RULE_IDS = [STU_MODEL_ID, CLASS_MODEL_ID];

class RuleService {
    static createRule = async (body) => {
        const schemaRuleId = body.schema_rule_id;

        const foundSchema = await RuleRepository.getSchemaRuleById(schemaRuleId);
        if (!foundSchema) throw new BadRequestError("Schema rule is not exists");

        return await RuleRepository.createRule(body);
    };

    static deleteRule = async ({ id }) => {
        return await RuleRepository.deleteRule({ id });
    };

    static updateRule = async ({ id, body }) => {
        return await RuleRepository.updateRule({ id, body });
    };

    static getAllRules = async ({ schemaRuleId }) => {
        return await RuleRepository.getAllRulesBySchemaRuleId({ schemaRuleId });
    };

    static createSchemaRule = async (body) => {
        const schemaId = body.schema_id;
        if (!schemaId) throw new BadRequestError("Invalid schema id");

        if (!SCHEMA_RULE_IDS.includes(schemaId)) throw new BadRequestError("Invalid schema id");

        const foundSchemaRule = await RuleRepository.getSchemaRuleBySchemaId(schemaId);
        if (foundSchemaRule) throw new ConflictError("Schema rule already exists for this schema id");

        return await RuleRepository.createSchemaRule({ ...body, fields });
    };

    static deleteSchemaRule = async ({ id }) => {
        return await RuleRepository.deleteSchemaRule({ id });
    };

    static updateSchemaRule = async ({ id, body }) => {
        return await RuleRepository.updateSchemaRule({ id, body });
    };

    static getAllSchemaRules = async () => {
        return await RuleRepository.getAllSchemaRules();
    };
}

module.exports = RuleService;
