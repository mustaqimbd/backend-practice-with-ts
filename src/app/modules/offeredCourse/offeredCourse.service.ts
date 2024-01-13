import { SemesterRegistrationModel } from './../semesterRegistration/semesterRegistration.model';
import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourseModel } from "./offeredCourse.model";
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { Course } from '../course/course.model';
import hasTimeConflict from './offeredCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
    const { semesterRegistration, academicFaculty, academicDepartment, faculty, course, section, days, startTime, endTime } = payload

    //check if the semester registration id is exist!
    const isSemesterRegistrationExist = await SemesterRegistrationModel.findById(semesterRegistration)
    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found!")
    }
    const academicSemester = isSemesterRegistrationExist.academicSemester

    const isAcademicFacultyExist = await AcademicFacultyModel.findById(academicFaculty)
    if (!isAcademicFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic faculty  not found!")
    }

    const isAcademicDepartmentExist = await AcademicDepartmentModel.findById(academicDepartment)
    if (!isAcademicDepartmentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Academic department not found!")
    }

    const isFacultyExist = await Faculty.findById(faculty)
    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!")
    }

    const isCourseExist = await Course.findById(course)
    if (!isCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found!")
    }

    const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({ _id: academicDepartment, academicFaculty })
    if (!isDepartmentBelongToFaculty) {
        throw new AppError(httpStatus.NOT_FOUND, `This ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`)
    }

    const isSameOfferedCourseExist = await OfferedCourseModel.findOne({ semesterRegistration, course, section })
    if (isSameOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "This offered course is already exist!")
    }
    const assignedSchedule = await OfferedCourseModel.find({ semesterRegistration, faculty, days: { $in: days } }).select('days startTime endTime')
    const newSchedule = { days, startTime, endTime }

    if (hasTimeConflict(assignedSchedule, newSchedule)) {
        throw new AppError(httpStatus.CONFLICT, "This faculty is not available at the time! choose another time or day!")
    }

    const result = await OfferedCourseModel.create({ ...payload, academicSemester });
    return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
    const getCourses = new QueryBuilder(OfferedCourseModel.find(), query).paginate().filter().sort()
    const result = await getCourses.queryModel
    return result
};

const getSingleOfferedCoursesFromDB = async (id: string) => {
    const result = await OfferedCourseModel.findById(id)
    return result;
};

const updateOfferedCoursesIntoDB = async (id: string, payload: Pick<TOfferedCourse, "faculty" | "days" | "startTime" | "endTime">) => {
    const { faculty, days, startTime, endTime } = payload

    const isOfferedCoursedExist = await OfferedCourseModel.findById(id)
    if (!isOfferedCoursedExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!")
    }

    const isFacultyExist = await Faculty.findById(faculty)

    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, " faculty  not found!")
    }

    const semesterRegistration = isOfferedCoursedExist.semesterRegistration

    const semesterRegistrationStatus = await SemesterRegistrationModel.findById(semesterRegistration)
    if (semesterRegistrationStatus?.status !== "ONGOING") {
        throw new AppError(httpStatus.CONFLICT, `This course can't be update! The course status is ${semesterRegistrationStatus?.status}`)
    }

    const assignedSchedule = await OfferedCourseModel.find({ semesterRegistration, faculty, days: { $in: days } }).select('_id days startTime endTime')
    const newSchedule = { days, startTime, endTime }

    if (hasTimeConflict(assignedSchedule, newSchedule, id)) {
        // console.log(assignedSchedule, newSchedule)
        throw new AppError(httpStatus.CONFLICT, "This faculty is not available at the time! choose another time or day!")
    }
    const result = await OfferedCourseModel.findByIdAndUpdate(
        id, payload, { new: true, runValidators: true })
    return result
};

const deleteOfferedCoursesFromDB = async (id: string) => {
    const isOfferedCoursedExist = await OfferedCourseModel.findById(id)
    if (!isOfferedCoursedExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!")
    }

    const semesterRegistration = isOfferedCoursedExist.semesterRegistration

    const semesterRegistrationStatus = await SemesterRegistrationModel.findById(semesterRegistration).select("status")

    if (semesterRegistrationStatus?.status !== "UPCOMING") {
        throw new AppError(httpStatus.NOT_FOUND, `This offered course can not be deleted! Because the semester is ${semesterRegistrationStatus?.status}`)
    }
    const result = await OfferedCourseModel.findByIdAndDelete(id)
    return result
};

export const offeredCourseServices = {
    createOfferedCourseIntoDB, getAllOfferedCoursesFromDB, getSingleOfferedCoursesFromDB,
    updateOfferedCoursesIntoDB, deleteOfferedCoursesFromDB
}