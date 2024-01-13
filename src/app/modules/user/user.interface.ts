import { Model } from "mongoose";
import { USER_ROLL } from "./user.const";

export interface TUser {
    id: string,
    email: string;
    password: string,
    needsPasswordChange: boolean;
    passwordChangeAt?: Date;
    role: "admin" | "student" | "faculty";
    status: "in-progress" | "blocked";
    isDeleted: boolean;
}

export interface TUserModel extends Model<TUser> {
    isUserExistByCustomId(id: string): Promise<TUser>,
    isJwtIssuedAfterChangedPassword(passwordChangeTime: Date, jwtIatTime: number): boolean
}

export type TUserRole = keyof typeof USER_ROLL