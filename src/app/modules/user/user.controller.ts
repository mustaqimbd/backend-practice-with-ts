import { RequestHandler } from "express"
import { userServices } from "./user.service";
import mongoose from "mongoose";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent: RequestHandler = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { password, student } = req.body;

        const result = await userServices.createStudentIntoDB(req.file, password, student, session);

        await session.commitTransaction();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: "Student is created successfully",
            data: result
        })

    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};


const createFaculty = catchAsync(async (req, res, next) => {
    const { password, faculty } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const result = await userServices.createFacultyIntoDB(req.file,password, faculty,session);
        
        await session.commitTransaction();
        await session.endSession()
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Faculty is created successfully',
            data: result,
        });
    } catch (error) {
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;
    const result = await userServices.createAdminIntoDB(password, adminData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin is created successfully',
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const result = await userServices.getMeFromDB(req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is retrieved successfully',
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const id = req.params.id
    const result = await userServices.changeStatusIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Status is retrieved successfully',
        data: result,
    });
});



export const userControllers = {
    createStudent, createFaculty,
    createAdmin, getMe, changeStatus
}