const ScoreService = require("../services/score.service");
const { SuccessResponse } = require("../cores/success.response");

class ScoreController {
  static createScore = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create new score success",
      metadata: await ScoreService.createScore(req.body),
    }).send(res);
  };

  static getScores = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get scores success",
      metadata: await ScoreService.getScores(req.params.studentId),
    }).send(res);
  };

  static getScoreOfClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get score of class success",
      metadata: await ScoreService.getScoreOfClass({
        classId: req.params.classId,
        subjectId: req.query.subject,
        semester: req.query.semester,
      }),
    }).send(res);
  };

  static updateScoresOfClass = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update scores of class success",
      metadata: await ScoreService.updateScoresOfClass(req.body),
    }).send(res);
  };

  static updateScore = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update score success",
      metadata: await ScoreService.updateScore(req.body),
    }).send(res);
  };
}

module.exports = ScoreController;
