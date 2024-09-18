'use strict'

const {
  db: { host, port, name, user, pass },
} = require('../configs/app.config.js')
const { Sequelize, Model } = require('sequelize')

const DB_DIALECT = 'mysql'

class DB {
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
      pool: {
        max: 15,
        min: 0,
        idle: 10000,
        acquire: 30000,
      },
    }

    const sequelize = new Sequelize(name, user, pass, options)

    sequelize
      .authenticate()
      .then(() => {
        console.log('Successfully connected to database')

        _this.sequelize = sequelize
        _this.Sequelize = Sequelize
        _this.#registerModels();
      })
      .catch(err => {
        console.log(`An error occur when authenticating database: ${err}`)
      })
  }

  #registerModels() {

  }
}

const db = new DB()

module.exports = db
