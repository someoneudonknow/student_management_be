const MaxAgeSpecification = require("./MaxAgeSpecification");
const MinAgeSpecification = require("./MinAgeSpecification");
const MaxStudentSpecification = require("./MaxStudentSpecification");

const SpecificationFactory = {
    create(rule) {
        const {field} = rule;

        switch (field) {
            case "max_age":
                return new MaxAgeSpecification(rule);
            case "min_age":
                return new MinAgeSpecification(rule);
            case "max_student_size":
                return new MaxStudentSpecification(rule)
            default:
                throw new Error(`No specification for field: ${field}`);
        }
    },
};

module.exports = SpecificationFactory