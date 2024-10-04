const StudentRepository = require("../models/repositories/student.repo");
const AddressRepository = require("../models/repositories/address.repo");
const { InternalServerError } = require("../cores/error.response");

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

    const newStudent = await StudentRepository.createStudent(studentPayload);
    if (!newStudent) throw new InternalServerError("Something went wrong");

    return { ...newStudent.toJSON(), address: newStudentAddress.toJSON() };
  };
}

module.exports = StudentService;
