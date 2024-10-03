"use strict";

const nodemailer = require("nodemailer");
const {
  mail: { service, user, pass, host, port },
} = require("../configs/app.config");
const logger = require("../helpers/logger");

const transport = nodemailer.createTransport({
  service: service,
  host,
  port,
  auth: {
    user,
    pass,
  },
  logger: process.env.NODE_ENV !== "production",
  debug: false && process.env.NODE_ENV !== "production",
});

transport.verify(function(error, success) {
  if (error) {
    logger("error", `Error while verify email: ${err}`);
  } else {
    logger("success", "Mail server is ready to take your message")
  }
});

module.exports = transport; 
