"use strict"

const redis = require("redis")

const connectionStatus = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error"
}

const CONNECTION_TIMEOUT = 10_000;

class RedisClient {
  client = null;
  connectionTimeout = null;

  connect() {
    this.client = redis.createClient({
      socket: {

      }
    })
  }
}
