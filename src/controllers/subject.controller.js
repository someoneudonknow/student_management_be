const SubjectService = require("../services/subject.service")
const {SuccessResponse} = require("../cores/success.response");

class SubjectController {
    static createSubject = async (req, res, next) => {
        return new SuccessResponse({
            message: "Create subject successfully",
            metadata: await SubjectService.createSubject(req.body)
        }).send(res)
    }

    static getSubjects = async (req, res, next) => {
        return new SuccessResponse({
            message: "Get subjects successfully",
            metadata: await SubjectService.getSubjects()
        }).send(res)
    }
}

module.exports = SubjectController;