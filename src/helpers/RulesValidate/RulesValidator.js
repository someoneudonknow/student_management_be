const DB = require("../../db/mysql.init");
const SpecificationFactory = require("./SpecificationFactory");
const RuleRepo = require("../../models/repositories/rule.repo");
const { NotFoundError } = require("../../cores/error.response");

class RuleValidator {
  static async validate(schemaId, payload) {
    const schemaRule = await RuleRepo.getSchemaRuleBySchemaId(schemaId);
    if (!schemaRule) throw new NotFoundError("Not Found Schema Rule");

    const rules = await DB.Rule.findAll({
      where: { schema_rule: schemaRule.id },
    });

    const errors = [];

    for (const rule of rules.map((r) => r.toJSON())) {
      const spec = SpecificationFactory.create(rule);
      if (!spec.isSatisfiedBy(payload)) {
        errors.push(spec.errorMessage());
      }
    }

    return errors.length > 0 ? errors : null;
  }
}

module.exports = RuleValidator;
