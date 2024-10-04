"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");
const StudentController = require("../../controllers/student.controller");

const routes = express.Router();

routes.use(authentication);
routes.post("/", asyncHandler(StudentController.createStudent));

module.exports = routes;
