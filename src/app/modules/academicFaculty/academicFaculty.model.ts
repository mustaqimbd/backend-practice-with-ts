import { Schema, model } from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const academicFacultySchema = new Schema<TAcademicFaculty>(
    {
        name: { type: String, required: true, unique: true }
    },
    { timestamps: true }
)

academicFacultySchema.pre('save', async function (next) {
    const isFacultyExist = await AcademicFacultyModel.findOne({ name: this.name });
    if (isFacultyExist) {
        throw new AppError(httpStatus.OK, 'This faculty is already exist!')
    }
    next()
})
academicFacultySchema.pre('findOneAndUpdate', async function (next) {
    const isFacultyExist = await AcademicFacultyModel.findOne(this.getQuery());
    if (!isFacultyExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'This faculty does not exist!')
    }
    next()
})

const AcademicFacultyModel = model<TAcademicFaculty>('Academic-faculty', academicFacultySchema)

export { AcademicFacultyModel }