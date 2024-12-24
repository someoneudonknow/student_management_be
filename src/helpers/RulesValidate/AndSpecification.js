const { default: Specification } = require("./Specification");

class AndSpecification extends Specification {
  constructor(...specs) {
    super();
    this.specs = specs;
  }

  isSatisfiedBy(entity) {
    return this.specs.every((spec) => spec.isSatisfiedBy(entity));
  }
}

module.exports = AndSpecification;
