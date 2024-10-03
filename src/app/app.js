const express = require("express");
const helmet = require("helmet")
const compression = require("compression")
const cors = require("cors");
const morgan = require("morgan");
const ErrorController = require("../controllers/error.controller.js")
require("dotenv").config()

const app = express();
const env = process.env.NODE_ENV

if (env === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("tiny"))
}

app.use(cors())
app.use(compression())
app.use(helmet())
app.use(express.json({ limit: "50mb", extended: true }))
app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}))

// init databases
require("../db/mysql.init.js").connect()
require("../db/redis.init.js").connect()

// init routes
app.use("/", require("../routes/index.js"))

// errors handling
app.all("*", ErrorController.handleEndpointNotFoundError)
app.use(ErrorController.handleApiErrors)

module.exports = app;
