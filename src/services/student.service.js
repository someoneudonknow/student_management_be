const StudentRepository = require("../models/repositories/student.repo");
const AddressRepository = require("../models/repositories/address.repo");
const ClassRepository = require("../models/repositories/class.repo");
const { InternalServerError, BadRequestError } = require("../cores/error.response");
const { deepCleanObject, pickDataInfoExcept } = require("../utils");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const parseOData = require("odata-sequelize");
const RuleValidator = require("../helpers/RulesValidate/RulesValidator");
const { STU_MODEL_ID, CLASS_MODEL_ID } = require("../constants/schemaId");

const classRoles = {
  STUDENT: "student",
  LEADER: "leader",
};

class StudentService {
  static createStudent = async (payload) => {
    let errors;
    if ((errors = await RuleValidator.validate(STU_MODEL_ID, payload))) {
      throw new BadRequestError(errors[0]);
    }

    const { first_name, last_name, email, gender, birthday, country, admission_day, address } =
      payload;

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

  static filterStudents = async (plainQuery) => {
    if (!plainQuery) return await this.getAllStudents({ page: 1, limit: 50 });

    const filterObj = parseOData(decodeURIComponent(plainQuery), sequelize);

    return await StudentRepository.getStudentWithAddressesAndFilter(filterObj);
  };

  static getAllStudents = async ({ page = 1, limit = 10 }) => {
    return await StudentRepository.getStudentsWithAddresses({ page, limit });
  };

  static updateStudent = async ({ id, update }) => {
    const foundStudent = await StudentRepository.getStudent(id);
    if (!foundStudent) throw new BadRequestError("Student not found");

    const address = update?.address;
    const class_role = update?.class_role;
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
    const foundStudent = await StudentRepository.getStudent(id);

    if (!foundStudent) throw new BadRequestError("Student not found");

    return await StudentRepository.deleteStudent(id);
  };

  static batchDeleteStudents = async (ids) => {
    if (ids.length > 100) throw new BadRequestError("Delete limit exceeded");

    const foundStudents = await StudentRepository.getStudentsByIds(ids);

    await Promise.all(
      foundStudents.map(async (st) => st.address && AddressRepository.deleteAddress(st.address)),
    );

    const deletedResult = await StudentRepository.deleteWithFilter({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    return deletedResult;
  };

  static search = async ({ text }) => {
    if (text.trim() === "") return [];
    return await StudentRepository.search({ payload: text });
  };

  /**
   * @deprecated This method shouldn't been used in anywhere
   * */
  static updateStudentClass_DEPRECATED = async ({ userIds, classId }) => {
    const foundStudents = await StudentRepository.getStudentsByIds(userIds);

    if (!foundStudents || foundStudents.length !== userIds.length)
      throw new BadRequestError("Students not found");

    const foundClass = await ClassRepository.getClass(classId);

    if (!foundClass) throw new BadRequestError("Class not found");

    return await StudentRepository.updateStudentClass({ userIds, classId });
  };

  static updateStudentClass = async ({ userIds, classId }) => {
    const foundStudents = await StudentRepository.getStudentsByIds(userIds);

    if (!foundStudents || foundStudents.length !== userIds.length)
      throw new BadRequestError("Students not found");

    const foundClass = await ClassRepository.getClass(classId);
    if (!foundClass) throw new BadRequestError("Class not found");

    const foundClassObj = foundClass.toJSON();
    let addedStudent = 0;

    for (const id of userIds) {
      const foundStudent = await StudentRepository.getStudent(id);
      if (!foundStudent) throw new BadRequestError("Student not found");

      if (foundStudent.class && foundStudent.class === classId) {
        continue;
      }

      let errors;
      if ((errors = await RuleValidator.validate(CLASS_MODEL_ID, foundClassObj))) {
        throw new BadRequestError(
          `${errors[0]}. Số lượng học sinh đã thêm vào lớp mới: ${addedStudent}` ||
            "Chạm giới hạn điều kiện",
        );
      }

      if (foundStudent.class && foundStudent.class !== classId) {
        await ClassRepository.decreaseClassSize(foundStudent.class);
      }

      foundStudent.class = classId;
      await ClassRepository.increaseClassSize(classId);

      foundClassObj.size++;
      await foundStudent.save();

      addedStudent++;
    }

    return {
      addedStudent,
    };
  };
}

module.exports = StudentService;
