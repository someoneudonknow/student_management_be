const ScoreRepository = require("../models/repositories/score.repo");
const { BadRequestError } = require("../cores/error.response");

class ScoreService {
  static async getScores(id) {
    return await ScoreRepository.getScores(id);
  }

  static async getScore(studentId, subjectId) {
    return await ScoreRepository.getScore(studentId, subjectId);
  }

  static async createScore(payload) {
    return await ScoreRepository.createScore(payload);
  }

  static async updateScore({ studentId, subjectId, payload }) {
    const foundScore = await ScoreService.getScore(studentId, subjectId);

    if (!foundScore) throw new BadRequestError("Score does not exist");

    return await ScoreRepository.updateScore(studentId, subjectId, payload);
  }
}

module.exports = ScoreService;
