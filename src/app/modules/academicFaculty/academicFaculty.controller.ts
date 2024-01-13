import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { academicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await academicFacultyServices.createAcademicFacultyIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic faculty is created successfully",
        data: result
    })
})

const getAcademicFaculty = catchAsync(async (req, res) => {
    const result = await academicFacultyServices.getAcademicFacultyFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic faculty is fetched successfully",
        data: result
    })
})

const getAllAcademicFaculty = catchAsync(async (req, res) => {
    const result = await academicFacultyServices.getAllAcademicFacultiesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All Academic faculties is fetched successfully",
        data: result
    })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
    const result = await academicFacultyServices.updateAcademicFacultyIntoDB(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Academic faculty was updated successfully",
        data: result
    })
})


export const academicFacultyControllers = {
    createAcademicFaculty,
    getAcademicFaculty,
    updateAcademicFaculty,
    getAllAcademicFaculty
}