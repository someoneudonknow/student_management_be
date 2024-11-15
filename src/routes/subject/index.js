const express = require('express');
const SubjectController = require("../../controllers/subject.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const authentication = require("../../middlewares/auth.middleware")

const router = express.Router()

router.use(authentication);

router.get('/', asyncHandler(SubjectController.getSubjects))
router.post("/", asyncHandler(SubjectController.createSubject))

module.exports = router;