import express from "express";
import { userControllers } from "./user.controller";
import { joyStudentValidationSchema } from "../student/student.validation";
import { validateRequest, validateRequestWithJoi } from "../../middlewares/validateRequest";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createAdminValidationSchema } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLL } from "./user.const";
import { userStatusValidationSchema } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";
import formDataIncludeIntoBody from "../../middlewares/dataIncludeIntoBody";

const userRoute = express.Router()

userRoute.post(
    '/create-student',
    upload.single("file"),
    auth(USER_ROLL.admin),
    formDataIncludeIntoBody,
    validateRequestWithJoi(joyStudentValidationSchema),
    userControllers.createStudent
)

userRoute.post(
    '/create-faculty',
    upload.single("file"),
    auth(USER_ROLL.admin),
    formDataIncludeIntoBody,
    validateRequest(createFacultyValidationSchema),
    userControllers.createFaculty,
);

userRoute.post(
    '/create-admin',
    // auth(USER_ROLL.admin),//need super admin
    validateRequest(createAdminValidationSchema),
    userControllers.createAdmin,
);

userRoute.patch(
    '/change-status/:id',
    auth('admin'),
    validateRequest(userStatusValidationSchema),
    userControllers.changeStatus,
);

userRoute.get(
    '/me',
    auth('student', 'faculty', 'admin'),
    userControllers.getMe,
);

export default userRoute