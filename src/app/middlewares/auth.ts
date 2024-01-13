import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from "http-status"
import AppError from "../errors/appError"
import catchAsync from "../utils/catchAsync"
import config from '../config/config';
import { TUserRole } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const auth = (...requiredRolls: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        const decode = jwt.verify(token, config.jwt_secret as string) as JwtPayload
        const { userId, role, iat } = decode
        const user = await UserModel.isUserExistByCustomId(userId)

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found!")
        }

        if (user.isDeleted || user.status === "blocked") {
            throw new AppError(httpStatus.FORBIDDEN, `This user is ${user.isDeleted && "deleted" || user.status}`)
        }

        console.log(decode)
        if (requiredRolls && !requiredRolls.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        const passwordChangeTime = user.passwordChangeAt
        if (passwordChangeTime && UserModel.isJwtIssuedAfterChangedPassword(passwordChangeTime, iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
        }

        req.user = decode as JwtPayload
        next()
    })
}

export default auth