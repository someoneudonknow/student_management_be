const DB = require("../../db/mysql.init");

class AddressRepository {
  static createAddress = async (payload, options) => {
    return await DB.Address.create(payload, options);
  };
}

module.exports = AddressRepository;
