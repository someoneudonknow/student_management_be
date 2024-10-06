const DB = require("../../db/mysql.init");

class AddressRepository {
  static createAddress = async (payload, options) => {
    return await DB.Address.create(payload, options);
  };

  static getAddress = async (id, options) => {
    return await DB.Address.findByPK(id, options);
  };

  static getAddresses = async ({ page, limit, filter }) => {
    const skip = (page - 1) * limit;
    return await DB.Address.findAndCountAll({
      where: filter,
      limit,
      offset: skip,
    });
  };

  static updateAddress = async (id, newAddress) => {
    const oldAddress = await this.getAddress(id);
    for (const field in newAddress) {
      oldAddress[field] = newAddress[field];
    }
    return await oldAddress.save();
  };

  static deleteAddress = async (id) => {
    return await DB.Address.destroy({
      where: {
        id,
      },
    });
  };
}

module.exports = AddressRepository;
