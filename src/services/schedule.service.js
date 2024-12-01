const ScheduleRepository = require("../models/repositories/schedule.repo");
const SubjectService = require("./subject.service");
const ClassService = require("./class.service");
const { set, get, del } = require("./redis.service");
const { BadRequestError } = require("../cores/error.response");

const SCHEDULES_REDIS_KEY = "schedules";
const SCHEDULING_REDIS_KEY = "scheduling";
const SCHEDULING_CONSTRAINT_REDIS_KEY = "constraint";

class ScheduleService {
  static async createSchedule(schedule) {
    return await ScheduleRepository.createSchedule(schedule);
  }

  static async getSchedules() {
    const schedules = await ScheduleRepository.getSchedules({ raw: true });

    const scheduleResult = schedules.reduce((result, value) => {
      const { class_id, ...scheduleDetails } = value;
      if (!result[class_id]) {
        result[class_id] = [];
      }
      result[class_id].push(scheduleDetails);
      return result;
    }, {});

    return scheduleResult;
  }

  static async getSchedulePerClass(classId) {
    return await ScheduleRepository.getSchedulePerClass(classId, { raw: true });
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
    //get schedule of other class
    let schedules = await ScheduleRepository.getScheduleExcludeClass(classId);

    //get schedule of current class
    let scheduling = await ScheduleRepository.getSchedulePerClass(classId, { raw: true });

    //get constraint of this class
    let constraint = await SubjectService.getSubjects({ raw: true });

    //calc constraint for fit with scheduling
    for (let item of scheduling) {
      constraint.find((el) => el.id === item.subject).number_of_period--;
    }

    const foundSubjectSlotIdx = constraint.findIndex(
      (el) => el.id === subject && el.number_of_period > 0,
    );

    if (foundSubjectSlotIdx === -1) throw new BadRequestError("Số tiết trên tuần đã đủ");

    const foundSubjectSchedulingIndex = scheduling.findIndex(
      (el) => el.day === day && el.section_order === sectionOrder,
    );

    if (foundSubjectSchedulingIndex >= 0) {
      const subjectId = scheduling[foundSubjectSchedulingIndex].id;
      const foundOldConstraintIndex = constraint.findIndex((el) => el.id === subjectId);

      if (foundOldConstraintIndex === -1) {
        constraint.push({
          id: scheduling[foundSubjectSchedulingIndex].subject,
          number_of_period: 1,
        });
      } else {
        constraint[foundOldConstraintIndex].number_of_period++;
      }

      if (constraint[foundSubjectSlotIdx].number_of_period === 1) {
        constraint.splice(foundSubjectSlotIdx, 1);
      } else {
        constraint[foundSubjectSlotIdx].number_of_period--;
      }

      scheduling.splice(foundSubjectSchedulingIndex, 1, {
        subject,
        day,
        section_order: sectionOrder,
      });

      //new code
      const foundScheduling = await ScheduleRepository.getSchedule({ day, sectionOrder });
      if (!foundScheduling) throw new BadRequestError("Có lỗi");

      foundScheduling.subject = subject;
      await foundScheduling.save();
      //end new code
    } else {
      const numberDuplicate = schedules.filter(
        (el) => el.subject === subject && el.day === day && el.section_order === sectionOrder,
      );

      switch (numberDuplicate.length) {
        case 0:
          scheduling.push({ subject, day, section_order: sectionOrder });
          if (constraint[foundSubjectSlotIdx].number_of_period === 1) {
            constraint.splice(foundSubjectSlotIdx, 1);
          } else {
            constraint[foundSubjectSlotIdx].number_of_period--;
          }

          //new code
          await ScheduleRepository.createSchedule({
            day,
            section_order: sectionOrder,
            subject,
            class_id: classId,
          });
          //end new code
          break;
        case 1:
          const foundSubject = await SubjectService.getSubject(subject);

          if (foundSubject.number_of_period > 2) {
            scheduling.push({ subject, day, section_order: sectionOrder });
            if (constraint[foundSubjectSlotIdx].number_of_period === 1) {
              constraint.splice(foundSubjectSlotIdx, 1);
            } else {
              constraint[foundSubjectSlotIdx].number_of_period--;
            }

            //new code
            await ScheduleRepository.createSchedule({
              day,
              section_order: sectionOrder,
              subject,
              class_id: classId,
            });
            //end new code
            break;
          } else {
            throw new BadRequestError("Không còn vị trí");
          }
        default:
          throw new BadRequestError("Không còn vị trí");
      }
    }
  }
}

module.exports = ScheduleService;
