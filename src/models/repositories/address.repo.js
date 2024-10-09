const { BadRequestError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { deepCleanObject } = require("../../utils");

class AddressRepository {
  static createAddress = async (payload, options) => {
    return await DB.Address.create(payload, options);
  };

  static getAddress = async (id, options) => {
    return await DB.Address.findByPK(id, options);
  };

  static getAddresses = async ({ page, limit, filter }) => {
    const skip = (page - 1) * limit;
    const data = await DB.Address.findAndCountAll({
      where: filter,
      limit,
      offset: skip,
    });

    return { page, totalPages: Math.ceil(data.count / limit), list: data?.rows };
  };

  static updateAddress = async (id, newAddress) => {
    const oldAddress = await AddressRepository.getAddress(id);

    if (!oldAddress) throw new BadRequestError("Address not found");

    for (const field in payload) {
      oldAddress[field] = payload[field];
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
