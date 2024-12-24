const Specification = require('./Specification')
const {parseRuleType} = require("../../utils");

class MinAgeSpecification extends Specification {
    constructor(rule) {
        super(rule);
    }

    isSatisfiedBy(payload) {
        const birthday = payload.birthday;
        if (!birthday) return true;

        const now = new Date();
        const stuBirthDay = new Date(birthday)
        const age = now.getFullYear() - stuBirthDay.getFullYear();

        return age >= this.getCompareValue();
    }

    errorMessage() {
        return `Student must be at least ${this.rule.compare_value} years old.`;
    }
}

module.exports = MinAgeSpecification;