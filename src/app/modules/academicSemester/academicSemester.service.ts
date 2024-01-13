
import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    type TSemesterCodeMapper = {
        [key: string]: string
    }
    const semesterCodeMapper: TSemesterCodeMapper = {
        Autumn: '01', Summer: '02', Fall: '03'
    }
    if (semesterCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code!')
    }
    const newSemester = await AcademicSemesterModel.create(payload);
    return newSemester;
};

const getAcademicSemesterFromDB = async (id: string) => {
    const result = await AcademicSemesterModel.findOne({ _id: id });
    return result;
};

const updateAcademicSemesterIntoDB = async (id: string, payload: TAcademicSemester) => {
    type TSemesterCodeMapper = {
        [key: string]: string
    }
    const semesterCodeMapper: TSemesterCodeMapper = {
        Autumn: '01', Summer: '02', Fall: '03'
    }

    if (semesterCodeMapper[payload.name] !== payload.code) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code!')
    }

    const updateSemester = await AcademicSemesterModel.findOneAndUpdate({ _id: id }, { $set: { ...payload } }, { new: true });
    return updateSemester;
};

const getAllAcademicSemesterFromDB = async () => {
    const result = await AcademicSemesterModel.find();
    return result;
};

export const academicSemesterServices = { createAcademicSemesterIntoDB, getAcademicSemesterFromDB, updateAcademicSemesterIntoDB, getAllAcademicSemesterFromDB }