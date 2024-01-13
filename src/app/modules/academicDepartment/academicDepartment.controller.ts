import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { academicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await academicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic Department is created successfully",
        data: result
    })
})

const getAcademicDepartment = catchAsync(async (req, res) => {
    const result = await academicDepartmentServices.getAcademicDepartmentFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic Department is fetched successfully",
        data: result
    })
})

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result = await academicDepartmentServices.getAllAcademicDepartmentsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All academic departments is fetched successfully",
        data: result
    })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const result = await academicDepartmentServices.updateAcademicDepartmentIntoDB(req.params.id, req.body);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic Department was updated successfully",
        data: result
    })
})


export const academicDepartmentControllers = {
    createAcademicDepartment,
    getAcademicDepartment,
    updateAcademicDepartment,
    getAllAcademicDepartments
}