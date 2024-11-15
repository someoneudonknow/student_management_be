const DB = require("../../db/mysql.init")
const {BadRequestError} = require("../../cores/error.response");

class ScoreRepository{
    static async getScores (studentId) {
        return await DB.Score.findAll({where: {student_id: studentId}})
    }

    static async getScore (studentId, subjectId) {
        return await DB.Score.findOne({where: {subject_id: subjectId, student_id: studentId}})
    }

    static async getScoreOnSubject (subjectId) {
        return await DB.Score.findAll({where: {subject_id: subjectId}})
    }

    static async createScore(payload, options) {
        await DB.Score.create(payload, options)
    }

    static async updateScore (studentId, subjectId, payload) {
        const foundScore = await DB.Score.findOne({where: {subject_id: subjectId, student_id: studentId}});

        if(!foundScore) throw new BadRequestError("Score does not exist");

        const fieldsChange = Object.keys(payload);
        for(let field of fieldsChange){
            foundScore[field] = payload[field];
        }

        return await foundScore.save();
    }
}

module.exports = ScoreRepository