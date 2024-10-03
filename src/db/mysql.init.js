'use strict'

const {
  db: { host, port, name, user, pass },
} = require('../configs/app.config.js')
const { Sequelize } = require('sequelize')
const fs = require("fs")
const path = require("path")
const { MODEL_FILE, MYSQL_INDEX, FK_CONSTRAINT } = require('../constants/regex.js')
const logger = require('../helpers/logger.js')

const DB_DIALECT = 'mysql'
const MODEL_DIR = "../models"
const CONNECTION_TIMEOUT = 30000 // have to increase the connection timeout because wsl2 take too much time to connect to mysql

class DB {
  sequelize;
  Sequelize;

  connect() {
    const _this = this

    const options = {
      host,
      port,
      dialect: DB_DIALECT,
      operatorAlias: false,
      define: {
        underscore: true,
      },
      dialectOptions: {
        connectTimeout: CONNECTION_TIMEOUT
      },
      pool: {
        max: 15,
        min: 0,
        idle: 10000,
        acquire: 30000,
      },
      logging: false
    }
    const sequelize = new Sequelize(name, user, pass, options)

    sequelize
      .authenticate()
      .then(() => {
        logger("success", "Successfully connected to database")

        _this.sequelize = sequelize
        _this.Sequelize = Sequelize
        _this.#registerModels()
        _this.#sync()
          .then(() => logger("success", "Register and synchronize models successfully"))
          .catch((e) => logger("error", `Error while registering and synchronizing models: ${e}`))
      })
      .catch(err => {
        logger("error", `An error occur while authenticating database: ${err}`)
      })
  }

  #registerModels() {
    const files = fs.readdirSync(path.join(__dirname, MODEL_DIR))
    const modelFileExtRegex = new RegExp(MODEL_FILE)

    files
      .filter(file => modelFileExtRegex.test(file))
      .forEach(file => {
        const modelDefineFunc = require(path.join(__dirname, MODEL_DIR, file))

        if (!(typeof modelDefineFunc === "function")) {
          throw new Error("Model file must be a function")
        }

        const model = modelDefineFunc(this.sequelize, this.Sequelize)

        this[model.name] = model
      })
  }

  async #sync() {
    if (this.sequelize) {
      await this.#dropOldIndexes()
      await this.#dropOldFkConstraints()
      await this.sequelize.sync({ alter: true })
    }
  }

  async #dropOldIndexes() {
    if (!this.sequelize) throw new Error("Can't drop old indexes")

    const rawTables = await this.sequelize.query("SHOW TABLES");
    const tables = rawTables[0].map((i) => i[Object.keys(rawTables[0][0])[0]]);

    for (const t of tables) {
      const rawKeys = await this.sequelize.query(`SHOW INDEX FROM ${t}`);
      const keys = rawKeys[0]
        .map((i) => i["Key_name"])
        .filter((i) => i.match(MYSQL_INDEX));

      for (const k of keys) {
        await this.sequelize.query(`ALTER TABLE ${t} DROP INDEX ${k}`);
      }
    }
  }

  async #dropOldFkConstraints() {
    const rawTables = await this.sequelize.query("SHOW TABLES");

    const tables = rawTables[0].map((i) => i[Object.keys(rawTables[0][0])[0]]);

    for (const t of tables) {
      const rawKeys = await this.sequelize
        .query(`SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE where TABLE_NAME ='${t}'`);

      const keys = rawKeys[0]
        .map((i) => i["CONSTRAINT_NAME"])
        .filter((i) => i.match(FK_CONSTRAINT));

      for (const k of keys) {
        await this.sequelize.query(
          `ALTER TABLE \`${t}\` DROP FOREIGN KEY ${k}`
        );
      }
    }
  }
}

const db = new DB()

module.exports = db
