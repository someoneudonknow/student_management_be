const {QueryTypes, Sequelize, Op, where, col, BelongsTo} = require("sequelize");
const DB = require("../../db/mysql.init");

class StudentRepository {
    static async createStudent(payload, options) {
        return await DB.Student.create(payload, options);
    }

    static async getStudent(id, options = {}) {
        return await DB.Student.findByPk(id, options);
    }

    static async getStudents({page, limit, filter = {}}) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const data = await DB.Student.findAndCountAll({
            where: filter,
            limit: limitNum,
            offset: skip,
        });

        return {page: pageNum, totalPages: Math.ceil(data.count / limit), list: data?.rows};
    }

    static async getStudentsByIds(idxs) {
        return await DB.Student.findAll({
            where: {
                id: {
                    [Op.or]: idxs,
                }
            }
        })
    }

    static async getStudentsWithAddresses({page, limit}) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const data = await DB.Student.findAndCountAll({
            order: [["createdAt", "DESC"]],
            attributes: {
                exclude: ["address", "createdAt", "updatedAt"],
            },
            include: [
                {
                    model: DB.Address,
                    as: "address",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    association: new BelongsTo(DB.Student, DB.Address, {
                        targetKey: "id",
                        foreignKey: "address",
                    }),
                },
            ],
            limit: limitNum,
            offset: skip,
        });

        return {page: pageNum, totalPages: Math.ceil(data.count / limit), list: data?.rows};
    }

    static async updateStudent(id, payload) {
        const foundStudent = await StudentRepository.getStudent(id);

        for (const field in payload) {
            foundStudent[field] = payload[field];
        }

        return await foundStudent.save();
    }

    static async deleteStudent(id) {
        return await DB.Student.destroy({where: {id}});
    }

    static async deleteWithFilter(filter) {
        return await DB.Student.destroy(filter);
    }

    static async search({payload = ""}) {
        const queryStr = `SELECT * FROM students s 
      WHERE MATCH(s.first_name, s.last_name) AGAINST (:payload)
      ORDER BY s.first_name, s.last_name ASC LIMIT :limit OFFSET :offset `;

        const foundStudent = await DB.sequelize.query(queryStr, {
            type: QueryTypes.SELECT,
            replacements: {payload: `${payload}`, limit: 10},
        });
        return foundStudent;
    }

    static async updateStudentClass({userIds, classId}) {
        const [affectedCount, affectedRows] = await DB.Student.update({class: classId}, {
            where: {
                id: {
                    [Op.in]: userIds
                },
            }
        })

        return {
            affectedCount, affectedRows
        }
    }
}

module.exports = StudentRepository;
