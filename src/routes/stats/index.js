const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/stats.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const authentication = require("../../middlewares/auth.middleware");

// Stats routes
router.use(authentication);

router.get("/students", asyncHandler(statsController.getStudentStats));
router.get("/scores", asyncHandler(statsController.getScoreStats));
router.get("/current-semester", asyncHandler(statsController.getCurrentSemesterStats));
router.get("/regression", asyncHandler(statsController.getRegressionData));
router.get("/subject-pass-rates", asyncHandler(statsController.getSubjectPassRates));

module.exports = router;