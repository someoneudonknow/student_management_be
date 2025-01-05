const ScoreRepository = require("../models/repositories/score.repo");
const { BadRequestError } = require("../cores/error.response");
const StudentService = require("./student.service");
const ClassRepository = require("../models/repositories/class.repo");
const StudentRepository = require("../models/repositories/student.repo");
const SubjectRepository = require("../models/repositories/subject.repo");

class ScoreService {
  static async getScores(id) {
    return await ScoreRepository.getScores(id);
  }

  static async getScore(studentId, subjectId) {
    return await ScoreRepository.getScore(studentId, subjectId);
  }

  static async getScoreOfClass({ classId, subjectId, semester }) {
    const foundClass = await ClassRepository.getClass(classId);
    if (!foundClass) throw new BadRequestError("Không tìm thấy lớp học");

    const foundSubject = await SubjectRepository.getSubject(subjectId);
    if (!foundSubject) throw new BadRequestError("Không tìm thấy môn học");

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const schoolYearStart = currentMonth > 6 ? currentYear : currentYear - 1;

    let result = await ScoreRepository.getScoreOfClass(
      classId,
      subjectId,
      semester,
      schoolYearStart,
    );

    if (result.length === 0) {
      //create score for student of class
      const foundStudents = await StudentService.getStudents({ class: classId });

      if (!foundStudents.list.length === 0) throw new BadRequestError("Lớp chưa có học sinh nào");

      for (let student of foundStudents.list) {
        // switch (semester) {
        //   case "I":
        //     await this.createScore({
        //       student: student.id,
        //       subject: subjectId,
        //       semester,
        //       school_year_start: currentYear,
        //       school_year_end: currentYear + 1,
        //     });
        //     break;
        //   case "II":
        //     const s = await this.createScore({
        //       student: student.id,
        //       subject: subjectId,
        //       semester,
        //       school_year_start: currentYear - 1,
        //       school_year_end: currentYear,
        //     });

        //     console.log(s);
        //     break;
        //   default:
        //     throw new BadRequestError("Học kỳ không hợp lệ");
        // }

        if (currentMonth > 6) {
          await this.createScore({
            student: student.id,
            subject: subjectId,
            semester,
            school_year_start: currentYear,
            school_year_end: currentYear + 1,
          });
        } else {
          await this.createScore({
            student: student.id,
            subject: subjectId,
            semester,
            school_year_start: currentYear - 1,
            school_year_end: currentYear,
          });
        }
      }
      result = await ScoreRepository.getScoreOfClass(classId, subjectId, semester, schoolYearStart);
    }

    return result;
  }

  static async createScore(payload) {
    return await ScoreRepository.createScore(payload);
  }

  static async updateScore({ studentId, subjectId, semester, payload }) {
    const foundScore = await ScoreService.getScore(studentId, subjectId);

    if (!foundScore) throw new BadRequestError("Score does not exist");

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const schoolYearStart = currentMonth > 6 ? currentYear : currentYear - 1;

    return await ScoreRepository.updateScore(
      studentId,
      subjectId,
      semester,
      schoolYearStart,
      payload,
    );
  }

  static async updateScoresOfClass({ classId, subjectId, semester, payloads }) {
    const foundClass = await ClassRepository.getClass(classId);
    if (!foundClass) throw new BadRequestError("Không tìm thấy lớp học");

    const foundSubject = await SubjectRepository.getSubject(subjectId);
    if (!foundSubject) throw new BadRequestError("Không tìm thấy môn học");

    const studentsRes = await StudentRepository.getStudents({
      page: 1,
      limit: 100,
      filter: { class: classId },
    });

    const studentIds = studentsRes.list.map((el) => el.id);

    const validPayload = payloads.filter((el) => studentIds.includes(el.id));

    if (validPayload.length === 0) throw new BadRequestError("Dữ liệu không khớp");

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const schoolYearStart = currentMonth > 6 ? currentYear : currentYear - 1;

    return await ScoreRepository.updateScoresOfClass(
      subjectId,
      semester,
      schoolYearStart,
      validPayload,
    );
  }
}

module.exports = ScoreService;
