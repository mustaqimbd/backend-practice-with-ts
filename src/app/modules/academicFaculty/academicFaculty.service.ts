import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const newSemester = await AcademicFacultyModel.create(payload);
    return newSemester;
};

const getAcademicFacultyFromDB = async (id: string) => {
    const result = await AcademicFacultyModel.findOne({ _id: id });
    return result;
};

const getAllAcademicFacultiesFromDB = async () => {
    const result = await AcademicFacultyModel.find();
    return result;
};

const updateAcademicFacultyIntoDB = async (id: string, payload: TAcademicFaculty) => {
    const updateSemester = await AcademicFacultyModel.findOneAndUpdate({ _id: id }, { $set: { ...payload } }, { new: true });
    return updateSemester;
};


export const academicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB
}