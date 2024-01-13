import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { changePasswordValidationSchema, forgetPasswordValidationSchema, loginValidationSchema, refreshTokenValidationSchema, resetPasswordValidationSchema } from "./auth.validation";
import { authControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLL } from "../user/user.const";

const authRoutes = Router()

authRoutes.post(
    '/login',
    validateRequest(loginValidationSchema),
    authControllers.loginUser
)

authRoutes.post(
    '/change-password',
    auth(USER_ROLL.student, USER_ROLL.faculty, USER_ROLL.admin),
    validateRequest(changePasswordValidationSchema),
    authControllers.changePassword
)

authRoutes.post(
    '/refresh-token',
    validateRequest(refreshTokenValidationSchema),
    authControllers.refreshToken
)

authRoutes.post(
    '/forget-password',
    validateRequest(forgetPasswordValidationSchema),
    authControllers.forgetPassword
)

authRoutes.post(
    '/reset-password',
    validateRequest(resetPasswordValidationSchema),
    authControllers.resetPassword
)

export default authRoutes