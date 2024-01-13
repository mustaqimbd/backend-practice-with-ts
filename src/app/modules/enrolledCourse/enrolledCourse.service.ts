import httpStatus, { TOO_MANY_REQUESTS } from "http-status"
import AppError from "../../errors/appError"
import { OfferedCourseModel } from "../offeredCourse/offeredCourse.model"
import { TEnrolledCourse } from "./enrolledCourse.interface"
import EnrolledCourse from "./enrolledCourse.model"
import StudentModel from "../student/student.model"
import mongoose from "mongoose"
import { SemesterRegistrationModel } from "../semesterRegistration/semesterRegistration.model"
import { Course } from "../course/course.model"
import { Faculty } from "../faculty/faculty.model"
import { calculateGradeAndPoints } from "./enrolledCourse.utils"

const createEnrolledCourseIntoDB = async (studentId: string, payload: TEnrolledCourse) => {
    const { offeredCourse } = payload

    const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse)
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!")
    }
    if (isOfferedCourseExist.maxCapacity < 1) {
        throw new AppError(httpStatus.BAD_GATEWAY, "Room is full!")
    }

    const student = await StudentModel.findOne({ id: studentId }, { _id: 1 })
    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExist.semesterRegistration,
        offeredCourse,
        student: student?._id
    })

    if (isStudentAlreadyEnrolled) {
        throw new AppError(httpStatus.CONFLICT, "The course is already enrolled!")
    }

    const { semesterRegistration, academicSemester, academicFaculty, academicDepartment, course, faculty } = isOfferedCourseExist

    const semesterRegistrationCourse = await SemesterRegistrationModel.findById(semesterRegistration, { maxCredit: 1 })

    const courseCredit = await Course.findById(course)

    const enrolledCourses = await EnrolledCourse.aggregate([
        { $match: { semesterRegistration, student: student?._id, } },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "enrolledCourseData"
            }
        },
        { $unwind: "$enrolledCourseData" },
        {
            $group: {
                _id: null,
                totalEnrolledCredit: { $sum: "$enrolledCourseData.credits" }
            }
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredit: 1
            }
        }
    ])

    const totalCredit = enrolledCourses.length > 0 ? enrolledCourses[0]?.totalEnrolledCredit : 0

    if (semesterRegistrationCourse?.maxCredit && (totalCredit + courseCredit?.credits) > semesterRegistrationCourse?.maxCredit) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have exceed maximum number of credit!")
    }
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const result = await EnrolledCourse.create({
            semesterRegistration,
            academicSemester,
            academicFaculty,
            academicDepartment,
            offeredCourse,
            course,
            student: student?._id,
            faculty,
            isEnrolled: true
        })

        if (!result) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to enroll in this course!")
        }

        const maxCapacity = --isOfferedCourseExist.maxCapacity
        await OfferedCourseModel.findByIdAndUpdate(
            offeredCourse, { maxCapacity }
        )
        session.commitTransaction()
        session.endSession()
        return result

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        session.abortTransaction()
        session.endSession()
        throw new Error(error)
    }
}

const updateEnrolledCourseMarksIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload

    const isOfferedCourseExist = await OfferedCourseModel.findById(offeredCourse)
    if (!isOfferedCourseExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Offered course not found!")
    }
    const isSemesterRegistrationExist = await SemesterRegistrationModel.findById(semesterRegistration)

    if (!isSemesterRegistrationExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Semester registration not found!")
    }
    const isStudentExist = await StudentModel.findById(student)

    if (!isStudentExist) {
        throw new AppError(httpStatus.NOT_FOUND, "Student not found!")
    }
    const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })

    if (!faculty) {
        throw new AppError(httpStatus.NOT_FOUND, "Faculty not found!")
    }

    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration, offeredCourse, student, faculty: faculty?._id
    })

    if (!isCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!")
    }

    const updatedData: Record<string, unknown> = {}

    if (courseMarks?.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } = isCourseBelongToFaculty.courseMarks
        const totalMarks = Math.ceil(classTest1 * 0.10) + Math.ceil(midTerm * 0.30) + Math.ceil(classTest2 * 0.10) + Math.ceil(finalTerm * 0.30)
        console.log(totalMarks)
        const result = calculateGradeAndPoints(totalMarks)
        updatedData.grade = result.grade
        updatedData.gradePoints = result.gradePoints
        updatedData.isCompleted = true
        console.log(result)
    }

    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            updatedData[`courseMarks.${key}`] = value
        }
    }

    const result = await EnrolledCourse.findByIdAndUpdate(
        isCourseBelongToFaculty._id,
        updatedData,
        {
            new: true
        })

    return result
}

export const enrolledCourseServices = {
    createEnrolledCourseIntoDB, updateEnrolledCourseMarksIntoDB
}