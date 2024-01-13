import { Schema, model } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
// import AppError from "../../errors/appError";
// import httpStatus from "http-status";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name: { type: String, required: true, unique: true },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Academic-faculty'
        }
    },
    { timestamps: true }
)

// academicDepartmentSchema.pre('save', async function (next) {
//     const isDepartmentExist = await AcademicDepartmentModel.findOne({ name: this.name });
//     if (isDepartmentExist) {
//         throw new AppError(httpStatus.NOT_FOUND, 'This department is already exist!')
//     }
//     next()
// })
// academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
//     const isDepartmentExist = await AcademicDepartmentModel.findOne(this.getQuery());
//     if (!isDepartmentExist) {
//         throw new AppError(httpStatus.NOT_FOUND, 'This department does not exist!')
//     }
//     next()
// })

const AcademicDepartmentModel = model<TAcademicDepartment>('Academic-department', academicDepartmentSchema)

export { AcademicDepartmentModel }