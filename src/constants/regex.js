const MODEL_FILE = /\w+.model.js/;
const MYSQL_INDEX = /[a-zA-Z]+_\d+/;
const FK_CONSTRAINT = /[a-zA-Z]+_ibfk_\w*/;
const EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_NUMBER = /^\d+$/;

module.exports = {
  MODEL_FILE,
  MYSQL_INDEX,
  FK_CONSTRAINT,
  EMAIL,
  PHONE_NUMBER,
};
