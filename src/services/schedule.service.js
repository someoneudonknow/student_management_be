const ScheduleRepository = require("../models/repositories/schedule.repo");
const SubjectService = require("./subject.service");
const ClassService = require("./class.service");
const { BadRequestError } = require("../cores/error.response");
const TeacherRepository = require("../models/repositories/teacher.repo");
const TeacherService = require("./teacher.service");

class ScheduleService {
  static async createSchedule(schedule) {
    return await ScheduleRepository.createSchedule(schedule);
  }

  static async getSchedules() {
    const schedules = await ScheduleRepository.getSchedules({}, { raw: true });

    const scheduleResult = schedules.reduce((result, value) => {
      if (!result[value.class]) {
        result[value.class] = [];
      }
      result[value.class].push(value);
      return result;
    }, {});

    return scheduleResult;
  }

  static async getTeacherSchedules() {
    const schedules = await ScheduleRepository.getSchedules({}, { raw: true });

    const scheduleResult = schedules.reduce((result, value) => {
      if (!value?.teacher) return result;

      if (!result[value.teacher]) {
        result[value.teacher] = [];
      }

      // if (!result[value.teacher][value.class]) {
      //   result[value.teacher][value.class] = [];
      // }
      // result[value.teacher][value.class].push(value);

      result[value.teacher].push(value);
      return result;
    }, {});

    return scheduleResult;
  }

  static async getSubjectSchedules() {
    const schedules = await ScheduleRepository.getSchedules({ teacher: null }, { raw: true });

    if (schedules.length === 0) return null;

    const scheduleResult = schedules.reduce((result, value) => {
      if (!result[value.subject]) {
        result[value.subject] = {};
      }

      if (!result[value.subject][value.class]) {
        result[value.subject][value.class] = [];
      }

      result[value.subject][value.class].push(value);
      return result;
    }, {});

    return scheduleResult;
  }

  static async getNonTeacherSchedule() {
    const schedules = await ScheduleRepository.getSchedules({ teacher: null }, { raw: true });

    const scheduleResult = schedules.reduce((result, value) => {
      if (!result[value.subject]) {
        result[value.subject] = [];
      } else if (result[value.subject].find((el) => el === value["class"])) return result;

      result[value.subject].push(value.class);
      return result;
    }, {});

    return scheduleResult;
  }

  static async getSchedulePerClass(classId) {
    return await ScheduleRepository.getSchedulePerClass(classId, {}, { raw: true });
  }

  //combine create and update schedule
  static async checkDuplicate({ subject, day, sectionOrder, classId }) {
    const foundClass = await ClassService.getClass(classId);
    if (!foundClass) throw new BadRequestError("Không tìm thấy lớp học");

    if (!subject) {
      return await ScheduleRepository.deleteSchedule(day, classId, sectionOrder);
    } else {
      const foundSubject = await SubjectService.getSubject(subject);
      if (!foundSubject) throw new BadRequestError("Không tìm thấy môn học");
    }

    //get schedule of current class
    let scheduling = await ScheduleRepository.getSchedulePerClass(classId, {}, { raw: true });

    //get constraint of this class
    let constraint = await SubjectService.getSubjects({ raw: true });

    //calc constraint for fit with scheduling
    for (let item of scheduling) {
      const foundConstraintIdx = constraint.findIndex((el) => el.id === item.subject);

      constraint[foundConstraintIdx].number_of_period--;
      if (constraint[foundConstraintIdx].number_of_period < 0)
        throw new BadRequestError("Số tiết vượt quá ở môn ", constraint[foundConstraintIdx].name);
    }

    const foundSubjectSlotIdx = constraint.findIndex(
      (el) => el.id === subject && el.number_of_period > 0,
    );

    if (foundSubjectSlotIdx === -1) throw new BadRequestError("Số tiết trên tuần đã đủ");

    const foundSubjectSchedulingIndex = scheduling.findIndex(
      (el) => el.day === day && el.section_order === sectionOrder,
    );

    if (foundSubjectSchedulingIndex >= 0) {
      const foundScheduling = await ScheduleRepository.getSchedule({ day, sectionOrder });
      if (!foundScheduling) throw new BadRequestError("Có lỗi khi lưu thông tin");

      foundScheduling.subject = subject;
      await foundScheduling.save();
    } else {
      let schedules = await ScheduleRepository.getScheduleExcludeClass(classId, {
        subject: subject,
        day: day,
        section_order: sectionOrder,
      });

      switch (schedules.length) {
        case 0:
          await ScheduleRepository.createSchedule({
            day,
            section_order: sectionOrder,
            subject,
            class: classId,
            teacher: null,
          });
          break;
        case 1:
          //only allow duplicate with one class
          const classDuplicate = new Set();
          const oldSubjectSchedules = await ScheduleRepository.getSchedules(
            { class: classId, subject },
            { raw: true },
          );

          if (oldSubjectSchedules.length > 0) {
            const otherSubjectSchedules = await ScheduleRepository.getScheduleExcludeClass(
              classId,
              {
                subject,
              },
            );

            if (otherSubjectSchedules.length > 0) {
              for (let oldSubjectSchedule of oldSubjectSchedules) {
                for (let otherSubjectSchedule of otherSubjectSchedules) {
                  // console.log(oldSubjectSchedule);
                  // console.log(otherSubjectSchedule);
                  // console.log("------------------------");
                  if (
                    oldSubjectSchedule.day === otherSubjectSchedule.day &&
                    oldSubjectSchedule.section_order === otherSubjectSchedule.section_order
                  ) {
                    console.log(3);
                    classDuplicate.add(otherSubjectSchedule.class);
                  }
                }
              }

              console.log(classDuplicate);

              if (classDuplicate.size > 1)
                throw new BadRequestError("Thời khóa biểu chưa chính xác");

              if (classDuplicate.size === 1) {
                const iter = classDuplicate.values();

                if (iter.next().value !== schedules[0].class)
                  throw new BadRequestError("Lịch học không hợp lệ");
              }
            }
          }

          const foundSubject = await SubjectService.getSubject(subject);

          if (foundSubject.number_of_period > 2) {
            await ScheduleRepository.createSchedule({
              day,
              section_order: sectionOrder,
              subject,
              class: classId,
              teacher: null,
            });
            break;
          } else {
            throw new BadRequestError("Không còn vị trí");
          }
        default:
          throw new BadRequestError("Không còn vị trí");
      }
    }
  }

  static async checkTeacherSchedule({ classId, teacherId }) {
    if (teacherId) {
      const foundTeacher = await TeacherRepository.getTeacher(teacherId);
      if (!foundTeacher) throw new BadRequestError("Không tìm thấy giáo viên");
    }

    const foundSchedulesOfClass = await ScheduleRepository.getSchedulePerClass(classId, {
      subject: foundTeacher.subject,
    });
    const foundSubject = await SubjectService.getSubject(foundTeacher.subject);

    if (!foundSchedulesOfClass || foundSchedulesOfClass.length < foundSubject.number_of_period)
      throw new BadRequestError("Lớp học chưa được lên lịch đầy đủ");

    const foundOtherSchedules = await ScheduleRepository.getScheduleExcludeClass(classId, {
      teacher: teacherId,
    });

    //check teacher has teached other class before
    if (foundOtherSchedules?.length > 0) {
      for (let otherSchedule of foundOtherSchedules) {
        for (let curSchedule of foundSchedulesOfClass) {
          if (
            curSchedule.day === otherSchedule.day &&
            curSchedule.section_order === otherSchedule.section_order
          )
            throw new BadRequestError("Lịch dạy của giáo viên bị trùng");
        }
      }
    }

    await ScheduleRepository.update(
      { teacher: teacherId },
      { class: classId, subject: foundTeacher.subject },
    );

    return true;
  }

  static async teacherSchedules() {
    //get all teacher and statistic depend on subject their teach
    const teachersRes = await TeacherService.getTeachers({ page: 1, limit: 100 });
    const teachers = teachersRes.list.reduce((result, value) => {
      if (!result[value.subject]) result[value.subject] = [];

      result[value.subject].push(value.id);

      return result;
    }, {});

    //Get schedule depend on struct {subject: {class: [...]}}
    const schedules = await this.getSubjectSchedules();

    if (!schedules) return await this.getTeacherSchedules();

    const teacherSchedules = {};

    for (let subject in schedules) {
      for (let curClass in schedules[subject]) {
        let isAssign = false;
        for (let teacher of teachers[subject]) {
          let isValid = true;
          //Initial object for teacher schedule
          if (!teacherSchedules?.[teacher]) {
            teacherSchedules[teacher] = {};
          }
          for (let schedule of schedules[subject][curClass]) {
            //Initial object for teacher schedule
            //Else block use to check teacher has time to study this class
            if (!teacherSchedules?.[teacher]?.[schedule.day])
              teacherSchedules[teacher][schedule.day] = [];
            else if (teacherSchedules[teacher][schedule.day]?.includes(schedule.section_order)) {
              isValid = false;
              break;
            }
          }
          //Check again when find valid teacher
          if (!isValid) continue;
          else {
            //assign teacher for this class
            isAssign = true;
            schedules[subject][curClass].map((el) => {
              el.teacher = teacher;

              if (!teacherSchedules[teacher]) teacherSchedules[teacher] = {};
              if (!teacherSchedules[teacher][el.day]) teacherSchedules[teacher][el.day] = [];
              teacherSchedules[teacher][el.day].push(el.section_order);

              return el;
            });
            //Break to next schedule
            break;
          }
        }
        if (!isAssign) {
          console.log("Lỗi");
          console.log("subject: ", subject);
          console.log("class: ", curClass);
        }
      }
    }

    //save teacher schedules
    for (let subject in schedules) {
      for (let curClass in schedules[subject]) {
        const teacherId = schedules[subject][curClass][0].teacher;

        await ScheduleRepository.update({ teacher: teacherId }, { subject, class: curClass });
      }
    }

    return await this.getTeacherSchedules();
  }
}

module.exports = ScheduleService;
