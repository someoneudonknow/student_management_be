const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const TeacherController = require("../../controllers/teacher.controller");
const authentication = require("../../middlewares/auth.middleware");

const routes = express.Router();

routes.use(authentication);

routes.get("/:teacherId", asyncHandler(TeacherController.getTeacher));
routes.get("/", asyncHandler(TeacherController.getTeachers));
routes.post("/", asyncHandler(TeacherController.createTeacher));
routes.patch("/:teacherId", asyncHandler(TeacherController.updateTeacher));
routes.delete("/:teacherId", asyncHandler(TeacherController.deleteTeacher));

module.exports = routes;
