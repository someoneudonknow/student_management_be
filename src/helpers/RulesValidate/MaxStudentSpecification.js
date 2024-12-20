const Specification = require("./Specification");

class MaxStudentSpecification extends Specification {
  constructor(rule) {
    super(rule);
  }

  isSatisfiedBy(payload) {
    const currentSize = Number(payload?.size);
    if (isNaN(currentSize)) return true;

    return currentSize + 1 <= this.getCompareValue();
  }

  errorMessage() {
    return `Số lượng học sinh không thể vượt quá ${this.rule.compare_value}`;
  }
}

module.exports = MaxStudentSpecification;

