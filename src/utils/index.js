"use strict"

const _ = require("lodash")

const deepCleanObject = (object) => {
  if (typeof object !== "object") return object;

  Object.keys(object).forEach((key) => {
    if (_.isPlainObject(object[key])) {
      const result = deepCleanObject(object[key]);

      if (_.isEmpty(result)) {
        delete object[key];
      } else {
        object[key] = result;
      }
    } else {
      if (_.isNull(object[key]) || _.isUndefined(object[key])) {
        delete object[key];
      }
    }
  });

  return object;
}

const pickDataInfo = (object = {}, fields = []) => {
  return _.pick(object, fields);
};

const pickDataInfoExcept = (object, fields) => {
  return _.omit(object, fields)

}

module.exports = {
  pickDataInfoExcept,
  deepCleanObject,
  pickDataInfo
}
