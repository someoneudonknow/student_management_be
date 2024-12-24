"use strict"

const crypto = require("crypto")
const JWT = require("jsonwebtoken")
const { createKey, set, get, del } = require("./redis.service")
const { InternalServerError } = require("../cores/error.response")

const KEY_TOKEN_REDIS_KEY = "user_token"

class KeyTokenService {
  static async createKeyPairs() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
      }
    })

    return {
      privateKey,
      publicKey
    }
  }

  static verifyToken(token, secret) {
    return JWT.verify(token, secret)
  }

  static async createTokenPair({ payload, publicKey, privateKey }) {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days"
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days"
    })

    const accessTokenDecode = KeyTokenService.verifyToken(accessToken, publicKey)
    const refreshTokenDecode = KeyTokenService.verifyToken(refreshToken, publicKey)

    return {
      accessToken: {
        token: accessToken,
        expiresIn: new Date(accessTokenDecode.exp * 1000)
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: new Date(refreshTokenDecode.exp * 1000)
      }
    }
  }

  static async createKeyToken({ userId, publicKey, refreshToken, privateKey, refreshTokenUsed }) {
    const key = createKey(KEY_TOKEN_REDIS_KEY, userId)

    const data = {
      publicKey,
      privateKey,
      refreshToken,
      refreshTokenUsed: refreshTokenUsed ? refreshTokenUsed : []
    }

    const dataStringified = JSON.stringify(data)
    const createdUserKeyToken = await set(key, dataStringified)

    if (!createdUserKeyToken) throw new InternalServerError("Some thing went wrong")

    return createdUserKeyToken;
  }

  static getKeyToken = async ({ userId }) => {
    return JSON.parse(await get(createKey(KEY_TOKEN_REDIS_KEY, userId)))
  }

  static deleteToken = async ({ userId }) => {
    return await del(createKey(KEY_TOKEN_REDIS_KEY, userId))
  }
}

module.exports = KeyTokenService

