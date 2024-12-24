"use strict"

const redisClient = require("../db/redis.init")

const client = redisClient.client;

const createKey = (modelName, id) => {
  return `${modelName}:${id}`
}

const set = async (key, value) => {
  return await client.set(key, value)
}

const get = async (key) => {
  return await client.get(key)
}

const del = async (key) => {
  return await client.del(key)
}

const hSet = async (key, data) => {
  return await client.hSet(key, data)
}

const hGet = async (key, field) => {
  return await client.hGet(key, field)
}

const hGetAll = async (key) => {
  return await client.hGetAll(key)
}

module.exports = {
  set,
  get,
  createKey,
  hSet,
  hGet,
  del,
  hGetAll
}
