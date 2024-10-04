"use strict";

const { BadRequestError, AuthFailureError, ForbiddenError } = require("../cores/error.response");
const asyncHandler = require("../helpers/asyncHandler");
const KeyTokenService = require("../services/keyToken.service");

const HEADERS = {
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh-token",
  CLIENT_ID: "x-client-id",
};

const authentication = asyncHandler(async (req, _, next) => {
  const clientId = req.headers[HEADERS.CLIENT_ID];
  if (!clientId) throw new BadRequestError("Invalid request");

  const userKeyToken = await KeyTokenService.getKeyToken({ userId: clientId });
  if (!userKeyToken) throw new BadRequestError("You're not logged in");

  const accessToken = req.headers[HEADERS.AUTHORIZATION];
  if (!accessToken) throw new BadRequestError("Invalid request");

  const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];

  if (refreshToken) {
    try {
      const decodedRefreshToken = KeyTokenService.verifyToken(refreshToken, userKeyToken.publicKey);

      req.userToken = userKeyToken;
      req.user = decodedRefreshToken;
      req.refreshToken = refreshToken;
    } catch (err) {
      throw new ForbiddenError("Token is invalid");
    }

    return next();
  }

  try {
    const decodedAccessToken = KeyTokenService.verifyToken(accessToken, userKeyToken.publicKey);
    if (decodedAccessToken.id !== clientId) throw new AuthFailureError("Authorization failed");

    req.userToken = userKeyToken;
    req.user = decodedAccessToken;

    return next();
  } catch (err) {
    throw new ForbiddenError("Token is invalid");
  }
});

module.exports = authentication;
