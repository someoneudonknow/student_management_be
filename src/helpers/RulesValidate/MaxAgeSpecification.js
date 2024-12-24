const Specification = require('./Specification')

class MaxAgeSpecification extends Specification {
    constructor(rule) {
        super(rule);
    }

    isSatisfiedBy(payload) {
        const birthday = payload.birthday;
        if(!birthday) return true;

        const now = new Date();
        const stuBirthDay = new Date(birthday)
        const age = now.getFullYear() - stuBirthDay.getFullYear();

        return age <= this.getCompareValue();
    }

    errorMessage() {
        return `Student must be lower than ${this.rule.compare_value} years old.`;
    }
}

module.exports = MaxAgeSpecification;