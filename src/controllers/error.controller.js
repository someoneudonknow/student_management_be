"use strict"

const { StatusCodes, ReasonPhrases } = require("../constants/httpStatusCodes")
const { NotFoundError } = require("../cores/error.response")

class ErrorController {
  static handleApiErrors = (err, _, res, next) => {
    const status = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR

    return res.status(status).json({
      status: "error",
      code: status,
      message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV === "development" && { stackTrace: err.stack })
    })
  }

  static handleEndpointNotFoundError = (req, _, next) => {
    return next(new NotFoundError(`Can't find ${req.originalUrl} on this server`))
  }
}

module.exports = ErrorController
