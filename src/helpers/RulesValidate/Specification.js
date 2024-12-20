const { parseRuleType } = require("../../utils");

class Specification {
  constructor(rule) {
    this.rule = rule;
  }

  getCompareValue() {
    return parseRuleType(this.rule.compare_value, this.rule.field_type);
  }

  parseOperatorAndCompare(value1, operator, value2) {
    switch (operator) {
      case "=":
        return value1 == value2;
      case "!=":
        return value1 != value2;
      case ">":
        return value1 > value2;
      case "<":
        return value1 < value2;
      case ">=":
        return value1 >= value2;
      case "<=":
        return value1 <= value2;
      default:
        throw new Error("Operator not valid");
    }
  }

  isSatisfiedBy(entity) {
    throw new Error("Not implemented");
  }
}

module.exports = Specification;
