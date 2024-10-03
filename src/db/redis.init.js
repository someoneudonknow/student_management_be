"use strict"

const redis = require("redis")
const { redis: { host, port } } = require("../configs/app.config.js")
const logger = require("../helpers/logger.js")
const { RedisError } = require("../cores/error.response.js")

const connectionStatus = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error"
}
const CONNECTION_TIMEOUT_MESSAGE = {
  message: "Redis connection error",
  code: -999
}
const CONNECTION_TIMEOUT = 10_000;
const MAX_RECONNECT = 20

class RedisClient {
  redisclient = null;
  connectionTimeout = null;

  connect() {
    this.redisclient = redis.createClient({
      socket: {
        host,
        port,
        reconnectStragegy: function(retries) {
          if (retries > MAX_RECONNECT) {
            logger("error", "Too many attempts to reconnect. Redis connection was terminated")
            return new RedisError("Too many retries")
          }

          return retries * 500
        }
      }
    })
    this.#handleConnectionEvents()
    this.redisclient.connect()
  }

  get client() {
    return this.redisclient
  }

  #handleConnectionEvents() {
    if (this.redisclient === null) {
      throw new Error("Connection was not established")
    }

    this.redisclient.on(connectionStatus.CONNECT, () => {
      logger("success", `Connection established - Connection status: ${connectionStatus.CONNECT}`)

      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout)
      }
    })

    this.redisclient.on(connectionStatus.ERROR, (err) => {
      if (process.env.NODE_ENV === "development") {
        logger("error", `Redis error: ${err}`)
      }

      logger("info", `Connection error - Connection status: ${connectionStatus.ERROR}`)
      this.#handleTimeoutErrors()
    })

    this.redisclient.on(connectionStatus.END, () => {
      logger("info", `Connection end - Connection status: ${connectionStatus.END}`)
      this.#handleTimeoutErrors()
    })

    this.redisclient.on(connectionStatus.RECONNECT, () => {
      logger("info", `Connection reconnecting - Connection status: ${connectionStatus.RECONNECT}`)

      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout)
      }
    })
  }

  #handleTimeoutErrors() {
    this.connectionTimeout = setTimeout(() => {
      throw new RedisError(
        CONNECTION_TIMEOUT_MESSAGE.message,
        CONNECTION_TIMEOUT_MESSAGE.code
      )
    }, CONNECTION_TIMEOUT)
  }
}

const redisClient = new RedisClient()

module.exports = redisClient;
