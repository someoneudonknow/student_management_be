class Operator {
  parseAndCmp(value1, operator, value2) {
    throw new Error("Not implemented.");
  }
}

class Equals extends Operator {
  parseAndCmp(value1, value2) {
    return value1 === value2;
  }
}
