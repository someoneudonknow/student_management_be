const StudentRepository = require("../models/repositories/student.repo");
const AddressRepository = require("../models/repositories/address.repo");
const ClassRepository = require("../models/repositories/class.repo");
const { InternalServerError, BadRequestError } = require("../cores/error.response");
const { deepCleanObject, pickDataInfoExcept } = require("../utils");

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

  static getStudent = async (id) => {
    return await StudentRepository.getStudent(id);
  };

  static getAllStudents = async ({ page = 1, limit = 10 }) => {
    return await StudentRepository.getStudentsWithAddresses({ page, limit });
  };

  static updateStudent = async ({ id, update }) => {
    const foundStudent = await StudentRepository.getStudent(id);
    if (!foundStudent) throw new BadRequestError("Student not found");

    const address = update?.address;
    let updatedOrNewAddress = null;

    if (address) {
      const addressData = pickDataInfoExcept(address, ["id"]);
      const cleanedAddressUpdateData = deepCleanObject(addressData);

      const updatedAddress = await AddressRepository.updateOrCreate(
        address.id,
        cleanedAddressUpdateData,
      );

      updatedOrNewAddress = updatedAddress.toJSON();
    }

    const studentData = pickDataInfoExcept(update, ["address", "id"]);
    const cleanedStudentUpdateData = deepCleanObject(studentData);

    if (updatedOrNewAddress && !foundStudent.toJSON()?.address) {
      cleanedStudentUpdateData.address = updatedOrNewAddress.id;
    }

    const updatedStudent = await StudentRepository.updateStudent(id, cleanedStudentUpdateData);
    if (!updatedStudent) throw new InternalServerError("Something went wrong while updating");

    return {
      ...pickDataInfoExcept(updatedStudent.toJSON(), ["address"]),
      Address: pickDataInfoExcept(updatedOrNewAddress, ["createdAt", "updatedAt"]),
    };
  };

  static deleteStudent = async (id) => {
    const foundStudent = await StudentRepository.getStudent(id)

    if(!foundStudent) throw new BadRequestError("Student not found")
      
    return await StudentRepository.deleteStudent(id);
  };

  static batchDeleteStudents = async (ids) => {
    console.log({ ids });

    // const deletedResult = await StudentRepository.deleteWithFilter({
    //   where: {
    //     id: {
    //       [Op.in]: ids,
    //     },
    //   },
    // });

    return null;
  };

  static search = async ({ text }) => {
    if (text.trim() === "") return [];
    return await StudentRepository.search({ page, limit, payload: text });
  };

  static updateStudentClass = async ({userIds, classId}) => {
    const foundStudents = await StudentRepository.getStudentsByIds(userIds);

    if(!foundStudents || foundStudents.length !== userIds.length) throw new BadRequestError("Students not found");

    const foundClass = await ClassRepository.getClass(classId)

    if(!foundClass) throw new BadRequestError("Class not found")

      return await StudentRepository.updateStudentClass({userIds, classId})
  }
}

module.exports = StudentService;
