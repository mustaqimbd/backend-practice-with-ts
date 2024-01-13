import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { semesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res) => {
    const result = await semesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Semester registration is created successfully",
        data: result
    })
})

const getSemesterRegistration = catchAsync(async (req, res) => {
    const result = await semesterRegistrationServices.getSemesterRegistrationsFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Semester registration is retrieved successfully",
        data: result
    })
})

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await semesterRegistrationServices.getSingleSemesterRegistrationsFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Semester registration is retrieved successfully",
        data: result
    })
})

const updateSemesterRegistration = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await semesterRegistrationServices.updateSemesterRegistrationsIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Semester registration is updated successfully",
        data: result
    })
})

export const semesterRegistrationControllers = {
    createSemesterRegistration, getSemesterRegistration, getSingleSemesterRegistration, updateSemesterRegistration
}