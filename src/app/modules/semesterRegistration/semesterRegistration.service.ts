import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistrationModel } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { registrationStatus } from "./semesterRegistration.const";

const createSemesterRegistrationIntoDB = async (payload: TSemesterRegistration) => {

    const academicSemester = payload?.academicSemester

    const isAcademicSemesterExist = await AcademicSemesterModel.findById(academicSemester)

    if (!isAcademicSemesterExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The semester is not found!')
    }
    const isSemesterRegistrationExist = await SemesterRegistrationModel.findOne({ academicSemester })

    if (isSemesterRegistrationExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The semester is already registered')
    }

    const isThereAnyUpcomingOrOngoingSemester = await SemesterRegistrationModel.findOne({
        $or: [
            { status: registrationStatus.UPCOMING },
            { status: registrationStatus.ONGOING }
        ]
    })

    if (isThereAnyUpcomingOrOngoingSemester) {
        throw new AppError(httpStatus.BAD_REQUEST, `There is already a ${isThereAnyUpcomingOrOngoingSemester.status}`)
    }

    const result = await SemesterRegistrationModel.create(payload);
    return result;
};

const getSemesterRegistrationsFromDB = async (query: Record<string, unknown>) => {

    const semesterRegistrationQuery = new QueryBuilder(SemesterRegistrationModel.find().populate('academicSemester'), query).filter().sort().paginate().fields()

    const result = await semesterRegistrationQuery.queryModel;
    return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
    const result = await SemesterRegistrationModel.findById(id)
    return result;
};

const updateSemesterRegistrationsIntoDB = async (id: string, payload: Partial<TSemesterRegistration>) => {

    const isTheSemesterRegistrationExist = await SemesterRegistrationModel.findById(id)

    if (!isTheSemesterRegistrationExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The semester registration is not found!')
    }
    if (isTheSemesterRegistrationExist.status === registrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `This semester registration is already ${isTheSemesterRegistrationExist.status}!`)
    }
    // upcoming to ended
    if (isTheSemesterRegistrationExist.status === registrationStatus.UPCOMING && payload.status === registrationStatus.ENDED) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not directly change status ${isTheSemesterRegistrationExist.status} to ${payload.status}!`)
    }
    // Ongoing to Upcoming
    if (isTheSemesterRegistrationExist.status === registrationStatus.ONGOING && payload.status === registrationStatus.UPCOMING) {
        throw new AppError(httpStatus.BAD_REQUEST, `You can not change status ${isTheSemesterRegistrationExist.status} to ${payload.status}!`)
    }

    const result = await SemesterRegistrationModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return result;
};

export const semesterRegistrationServices = {
    createSemesterRegistrationIntoDB, getSemesterRegistrationsFromDB, getSingleSemesterRegistrationsFromDB,
    updateSemesterRegistrationsIntoDB
}