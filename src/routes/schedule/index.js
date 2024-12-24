const express = require("express");
const ScheduleController = require("../../controllers/schedule.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authentication);

router.get("/", asyncHandler(ScheduleController.getSchedules));
router.get("/teachers", asyncHandler(ScheduleController.getTeacherSchedules));
router.get("/non-teachers", asyncHandler(ScheduleController.getNonTeacherSchedule));
router.get("/:classId", asyncHandler(ScheduleController.getSchedulePerClass));
router.post("/", asyncHandler(ScheduleController.createSchedules));
router.post("/check", asyncHandler(ScheduleController.checkSchedule));
router.patch("/teachers", asyncHandler(ScheduleController.teacherSchedules));
router.patch("/", asyncHandler(ScheduleController.checkTeacherSchedule));
// router.delete("/", asyncHandler(ScheduleController.removeCache));

module.exports = router;
