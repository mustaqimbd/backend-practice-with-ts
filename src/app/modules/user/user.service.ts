import mongoose from "mongoose";
import { TStudent } from "../student/student.interface"
import StudentModel from "../student/student.model"
import { UserModel } from "./user.model"
import { AcademicSemesterModel } from "../academicSemester/academicSemester.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./utils";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { Admin } from "../admin/admin.model";
import config from "../../config/config";
import { TFaculty } from "../faculty/faculty.interface";
import { TUser } from "./user.interface";
import { AcademicDepartmentModel } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { USER_ROLL } from "./user.const";
import { JwtPayload } from 'jsonwebtoken';
import sendImageToCloudinary from "../../utils/sendImageToCloudinary";
import { UploadApiResponse } from "cloudinary";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStudentIntoDB = async (file: any, password: string, payload: TStudent, session: mongoose.ClientSession) => {

    const semester = await AcademicSemesterModel.findById({ _id: payload.admissionSemester })
    const createdId = await generateStudentId(semester?.year, semester?.code)
    const newUser = await UserModel.create([{ id: createdId, password, email: payload.email }], { session });

    if (!newUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!')
    }

    const filename = `${Date.now()}_${payload.name.firstName}`
    const imgLink = await sendImageToCloudinary(file.path, filename) as UploadApiResponse

    payload.profileImg = imgLink?.secure_url
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newStudent = await StudentModel.create([payload], { session });

    if (!newStudent.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!')
    }
    return newStudent[0];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty, session: mongoose.ClientSession) => {

    // create a user object
    const userData: Partial<TUser> = { email: payload.email };
    userData.password = password || (config.default_password as string);
    userData.role = 'faculty';

    const filename = `${Date.now()}_${payload.name.firstName}`
    const imgLink = await sendImageToCloudinary(file.path, filename) as UploadApiResponse
    payload.profileImg = imgLink?.secure_url

    // find academic department info
    const academicDepartment = await AcademicDepartmentModel.findById(
        payload.academicDepartment,
    );

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department not found');
    }

    userData.id = await generateFacultyId()
    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    return newFaculty;
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
    // create a user object
    const userData: Partial<TUser> = { email: payload.email };
    //if password is not given , use default password
    userData.password = password || (config.default_password as string);
    //set student role
    userData.role = 'admin';

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();

        // create a user (transaction-1)
        const newUser = await UserModel.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getMeFromDB = async (user: JwtPayload) => {
    const { userId, role } = user
    let result = null
    if (role === USER_ROLL.student) {
        result = await StudentModel.findOne({ id: userId }).populate('user')
    }
    if (role === USER_ROLL.faculty) {
        result = await Faculty.findOne({ id: userId }).populate('user')
    }
    if (role === USER_ROLL.admin) {
        result = await Admin.findOne({ id: userId }).populate('user')
    }
    console.log(user)
    return result
};

const changeStatusIntoDB = async (_id: string, payload: Record<string, string>) => {
    const result = await UserModel.findByIdAndUpdate(_id, payload, { new: true })
    return result
};

export const userServices = { createStudentIntoDB, createFacultyIntoDB, createAdminIntoDB, getMeFromDB, changeStatusIntoDB }