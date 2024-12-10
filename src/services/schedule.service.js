const ScheduleRepository = require("../models/repositories/schedule.repo");
const SubjectService = require("../services/subject.service");
const { set, get, del } = require("./redis.service");
const { BadRequestError, InternalServerError } = require("../cores/error.response");

const SCHEDULES_REDIS_KEY = "schedules";
const SCHEDULING_REDIS_KEY = "scheduling";
const SCHEDULING_CONSTRAINT_REDIS_KEY = "constraint";

class ScheduleService {
  static async createSchedules({ payload }) {
    // await del(SCHEDULING_REDIS_KEY)
    // await del(SCHEDULING_CONSTRAINT_REDIS_KEY)

    //check total period
    for (let item of payload) {
      const result = await ScheduleService.checkDuplicate(item);
      if (result !== true) throw new BadRequestError("Something went wrong");
    }

    await del(SCHEDULING_REDIS_KEY);
    await del(SCHEDULES_REDIS_KEY);
    await del(SCHEDULING_CONSTRAINT_REDIS_KEY);

    return await ScheduleRepository.createSchedules(payload);
  }

  static async getSchedules(options) {
    return await ScheduleRepository.getSchedules(options);
  }

  static async removeCache() {
    await del(SCHEDULING_REDIS_KEY);
    await del(SCHEDULING_CONSTRAINT_REDIS_KEY);
    await del(SCHEDULES_REDIS_KEY);
  }

  static async checkDuplicate({ subject, day, section_order }) {
    const foundSubject = await SubjectService.getSubject(subject);

    if (!foundSubject) throw new BadRequestError("Subject not found");

    let schedules =
      JSON.parse(await get(SCHEDULES_REDIS_KEY)) ??
      (await ScheduleService.getSchedules({ raw: true }));
    let scheduling = JSON.parse(await get(SCHEDULING_REDIS_KEY)) ?? [];
    let constraint =
      JSON.parse(await get(SCHEDULING_CONSTRAINT_REDIS_KEY)) ??
      (await SubjectService.getSubjects({ raw: true }));

    const foundSubjectSlotIdx = constraint.findIndex((el) => el.id === subject);

    if (foundSubjectSlotIdx === -1) throw new BadRequestError("Full period per week");

    const foundSubjectSchedulingIndex = scheduling.findIndex(
      (el) => el.day === day && el.section_order === section_order,
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
        const foundSubjectId = constraint[foundOldConstraintIndex].number_of_period++;
      }

      if (constraint[foundSubjectSlotIdx].number_of_period === 1) {
        constraint.splice(foundSubjectSlotIdx, 1);
      } else {
        constraint[foundSubjectSlotIdx].number_of_period--;
      }

      scheduling.splice(foundSubjectSchedulingIndex, 1, { subject, day, section_order });
    } else {
      const numberDuplicate = schedules.filter(
        (el) => el.subject === subject && el.day === day && el.section_order === section_order,
      );

      switch (numberDuplicate.length) {
        case 0:
          scheduling.push({ subject, day, section_order });
          if (constraint[foundSubjectSlotIdx].number_of_period === 1) {
            constraint.splice(foundSubjectSlotIdx, 1);
          } else {
            constraint[foundSubjectSlotIdx].number_of_period--;
          }
          break;
        case 1:
          const foundSubject = await SubjectService.getSubject(subject);

          if (foundSubject.number_of_period > 2) {
            scheduling.push({ subject, day, section_order });
            if (constraint[foundSubjectSlotIdx].number_of_period === 1) {
              constraint.splice(foundSubjectSlotIdx, 1);
            } else {
              constraint[foundSubjectSlotIdx].number_of_period--;
            }
            break;
          } else {
            throw new BadRequestError("Not enough slot");
          }
        default:
          throw new BadRequestError("Not enough slot");
      }
    }

    await set(SCHEDULES_REDIS_KEY, JSON.stringify(schedules)); //not change => not include expires time
    await set(SCHEDULING_REDIS_KEY, JSON.stringify(scheduling), {
      EX: 60 * 15, //15 minutes
    });
    await set(SCHEDULING_CONSTRAINT_REDIS_KEY, JSON.stringify(constraint), {
      EX: 60 * 15, //15 minutes
    });

    return true;
  }
}

module.exports = ScheduleService;
