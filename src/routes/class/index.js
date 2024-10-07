const express = require("express");
const ClassController = require("../../controllers/class.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");

const routes = express.Router();

routes.use(authentication);
routes.get("/", asyncHandler(ClassController.getClasses));
routes.get("/:classId", asyncHandler(ClassController.getClass));
routes.post("/", asyncHandler(ClassController.createClass));
routes.patch("/:classId", asyncHandler(ClassController.updateClass));
routes.delete("/:classId", asyncHandler(ClassController.deleteClass));

module.exports = routes;
