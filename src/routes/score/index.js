const express = require('express');
const asyncHandler = require("../../helpers/asyncHandler");
const ScoreController = require("../../controllers/score.controller");
const authentication = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authentication);

router.get("/:studentId", asyncHandler(ScoreController.getScores))
router.post("/", asyncHandler(ScoreController.createScore))
router.patch("/", asyncHandler(ScoreController.updateScore))

module.exports = router;