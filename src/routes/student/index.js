"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");
const StudentController = require("../../controllers/student.controller");
const restrictTo = require("../../middlewares/restrictTo.middleware");

const routes = express.Router();

routes.use(authentication);
routes.use(restrictTo(["admin"]));
routes.get("/search", asyncHandler(StudentController.search));
routes.post("/", asyncHandler(StudentController.createStudent));
routes.get("/filter", asyncHandler(StudentController.filterStudents));
routes.get("/:studentId", asyncHandler(StudentController.getStudent));
routes.get("/", asyncHandler(StudentController.getAllStudents));
routes.delete("/:studentId", asyncHandler(StudentController.deleteStudent));
routes.patch("/:studentId", asyncHandler(StudentController.updateStudent));
routes.patch("/", asyncHandler(StudentController.updateStudentClass));
routes.post("/batchDelete", asyncHandler(StudentController.batchDeleteStudents));

module.exports = routes;
