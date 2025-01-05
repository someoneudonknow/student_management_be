const { SuccessResponse } = require("../cores/success.response");
const StatsService = require("../services/stats.service");

class StatsController {
  getAvailableYears = async (req, res, next) => {
    new SuccessResponse({
      message: "Get available years successfully",
      metadata: await StatsService.getAvailableYears(),
    }).send(res);
  };
  getStudentStats = async (req, res, next) => {
    new SuccessResponse({
      message: "Get student stats successfully",
      metadata: await StatsService.getStudentStats(),
    }).send(res);
  };

  getScoreStats = async (req, res, next) => {
    new SuccessResponse({
      message: "Get score stats successfully",
      metadata: await StatsService.getScoreStats(),
    }).send(res);
  };

  getCurrentSemesterStats = async (req, res, next) => {
    new SuccessResponse({
      message: "Get current semester stats successfully",
      metadata: await StatsService.getCurrentSemesterStats(),
    }).send(res);
  };

  getRegressionData = async (req, res, next) => {
    new SuccessResponse({
      message: "Get regression data successfully",
      metadata: await StatsService.getRegressionData(),
    }).send(res);
  };

  async getSubjectPassRates(req, res) {
    const data = await StatsService.getSubjectPassRates();
    return res.status(200).json({
      status: "success",
      code: 200,
      metadata: data,
    });
  }
}

module.exports = new StatsController();
