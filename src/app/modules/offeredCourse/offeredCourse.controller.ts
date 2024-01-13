import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { offeredCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await offeredCourseServices.createOfferedCourseIntoDB(req.body?.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Offered course is created successfully",
        data: result
    })
})

const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await offeredCourseServices.getAllOfferedCoursesFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Offered courses are retrieved successfully!",
        data: result
    })
})

const getSingleOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await offeredCourseServices.getSingleOfferedCoursesFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Semester registration is retrieved successfully",
        data: result
    })
})

const updateOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await offeredCourseServices.updateOfferedCoursesIntoDB(id, req.body?.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Offered course is updated successfully",
        data: result
    })
})

const deleteOfferedCourse = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await offeredCourseServices.deleteOfferedCoursesFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Offered course is deleted successfully",
        data: result
    })
})

export const OfferedCourseControllers = {
    createOfferedCourse, getAllOfferedCourses, getSingleOfferedCourse, updateOfferedCourse, deleteOfferedCourse
}