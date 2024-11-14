const express = require('express');
const ScheduleController = require("../../controllers/schedule.controller")
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authentication);


router.get("/", asyncHandler(ScheduleController.getSchedules))
router.post("/", asyncHandler(ScheduleController.createSchedules))
router.post("/check", asyncHandler(ScheduleController.checkSchedule))
router.delete("/", asyncHandler(ScheduleController.removeCache))

module.exports = router;