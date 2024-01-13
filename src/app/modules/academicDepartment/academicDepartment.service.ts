import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartmentModel } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartmentModel.create(payload);
    return result;
};

const getAcademicDepartmentFromDB = async (id: string) => {
    const result = await AcademicDepartmentModel.findOne({ _id: id }).populate('academicFaculty');
    return result;
};

const getAllAcademicDepartmentsFromDB = async () => {
    const result = await AcademicDepartmentModel.find().populate('academicFaculty');
    return result;
};

const updateAcademicDepartmentIntoDB = async (id: string, payload: TAcademicDepartment) => {
    const result = await AcademicDepartmentModel.findOneAndUpdate({ _id: id }, { $set: { ...payload } }, { new: true });
    return result;
};


export const academicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB
}