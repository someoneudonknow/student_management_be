const { BadRequestError } = require("../../cores/error.response");
const DB = require("../../db/mysql.init");
const { InternalServerError } = require("../../cores/error.response.js");
const { deepCleanObject } = require("../../utils");

class AddressRepository {
  static createAddress = async (payload, options) => {
    return await DB.Address.create(payload, options);
  };

  static getAddress = async (id, options = {}) => {
    return await DB.Address.findByPk(id, options);
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

  static updateOrCreate = async (id, address) => {
    const oldAddress = await AddressRepository.getAddress(id);

    if (oldAddress) {
      for (const field in address) {
        oldAddress[field] = address[field];
      }

      const updated = await oldAddress.save();
      if (!updated) throw new InternalServerError("Something went wrong");

      return updated;
    } else {
      const createdAddress = await AddressRepository.createAddress(address);
      if (!createdAddress) throw new InternalServerError("Something went wrong");

      return createdAddress;
    }
  };

  static updateAddress = async (id, newAddress) => {
    const oldAddress = await AddressRepository.getAddress(id);
    if (!oldAddress) throw new BadRequestError("Address not found");

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
