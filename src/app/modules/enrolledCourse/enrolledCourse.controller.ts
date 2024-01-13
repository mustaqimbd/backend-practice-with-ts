import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { enrolledCourseServices } from "./enrolledCourse.service"

const createEnrolledCourse = catchAsync(async (req, res) => {
    const studentId = req.user.userId
    const result = await enrolledCourseServices.createEnrolledCourseIntoDB(studentId, req.body)

    sendResponse(res, {
        message: "Course is successfully enrolled",
        data: result
    })
})

const updateEnrolledCourseMark = catchAsync(async (req, res) => {
    const facultyId = req.user.userId
    const result = await enrolledCourseServices.updateEnrolledCourseMarksIntoDB(facultyId, req.body)

    sendResponse(res, {
        message: "Mark is successfully updated!",
        data: result
    })
})

export const enrolledCourseControllers = {
    createEnrolledCourse, updateEnrolledCourseMark
}