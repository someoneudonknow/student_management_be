"use strict"

const { BadRequestError } = require("../cores/error.response");
const { createKey, set, get, del } = require("./redis.service");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const OTP_REDIS_KEY = "otp"

class OTPService {
  static generateOTP = () => {
    return crypto.randomBytes(16).toString("hex");
  };

  static createOTP = async ({ userId, timeoutInMinutes = 10 }) => {
    const key = createKey(OTP_REDIS_KEY, userId);
    const otp = OTPService.generateOTP();
    const otpHashed = await bcrypt.hash(otp, 10);

    await set(key, otpHashed, {
      EX: 60 * timeoutInMinutes,
      NX: true,
    });

    return otp;
  };

  static verifyOTP = async ({ otp, userId }) => {
    const key = createKey(OTP_REDIS_KEY, userId);
    const otpStored = await get(key);

    if (!otpStored) {
      throw new BadRequestError("OTP is invalid");
    }

    const validOTP = bcrypt.compare(otp, otpStored);

    return validOTP;
  };
}

module.exports = OTPService;
