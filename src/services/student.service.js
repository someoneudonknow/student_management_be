const StudentRepository = require("../models/repositories/student.repo");
const AddressRepository = require("../models/repositories/address.repo");
const { InternalServerError, BadRequestError } = require("../cores/error.response");
const { deepCleanObject } = require("../utils");
const dateValidate = require("../helpers/dateValidate");

const classRoles = {
  STUDENT: "student",
  LEADER: "leader",
};

class StudentService {
  static createStudent = async ({
    first_name,
    last_name,
    email,
    gender,
    birthday,
    country,
    admission_day,
    address,
  }) => {
    const newStudentAddress = await AddressRepository.createAddress(address);
    if (!newStudentAddress) throw new InternalServerError("Something went wrong");

    const studentPayload = {
      first_name,
      last_name,
      email,
      gender,
      birthday,
      country,
      admission_day,
      class_role: classRoles.STUDENT,
      address: newStudentAddress.id,
    };

    //CHange range of age from rule
    const ageValidate = dateValidate(birthday, 12, 15);
    if (!ageValidate) throw new BadRequestError("Age must be in range [12, 15]");

    const newStudent = await StudentRepository.createStudent(studentPayload);
    if (!newStudent) throw new InternalServerError("Something went wrong");

    return { ...newStudent.toJSON(), address: newStudentAddress.toJSON() };
  };

  static getStudent = async (id) => {
    return await StudentRepository.getStudent(id);
  };

  static getAllStudents = async ({ page = 1, limit = 10 }) => {
    return await StudentRepository.getStudents({ page, limit });
  };

  static updateStudent = async ({ id, update }) => {
    const hasUpdateBirthday = update.hasOwnProperty("birthday");
    if (hasUpdateBirthday) {
      const ageValidate = dateValidate(update["birthday"], 12, 15);
      if (!ageValidate) throw new BadRequestError("Age must be in range [12, 15]");
    }

    const protectFields = ["id"];
    for (const field of protectFields) {
      delete update[field];
    }
    const payload = deepCleanObject(update);

    return await StudentRepository.updateStudent(id, payload);
  };

  static deleteStudent = async (id) => {
    return await StudentRepository.deleteStudent(id);
  };
}

module.exports = StudentService;
