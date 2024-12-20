"use strict";

const _ = require("lodash");
const {InternalServerError} = require("../cores/error.response");

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
};

const pickDataInfo = (object = {}, fields = []) => {
    return _.pick(object, fields);
};

const pickDataInfoExcept = (object, fields) => {
    return _.omit(object, fields);
};

const getMatchedRegex = (str, regex) => {
    const matches = [];
    const splitter = new RegExp(regex, "gm");
    let match;

    while ((match = splitter.exec(str))) {
        matches.push(match[1]);
    }

    return matches;
};

const parseRuleType = (value, type) => {
    const availableTypes = ["NUMBER", "STRING", "BOOLEAN", "DECIMAL"];

    if (!availableTypes.includes(type)) {
        throw new InternalServerError("Unsupported type.");
    }

    switch (type) {
        case "NUMBER":
            return parseInt(value, 10);
        case "STRING":
            return value;
        case "BOOLEAN":
            return value === "true";
        case "DECIMAL":
            return parseFloat(value);
        default: throw new Error("Unsupported type.");
    }
}

module.exports = {
    pickDataInfoExcept,
    deepCleanObject,
    pickDataInfo,
    getMatchedRegex,
    parseRuleType
};
