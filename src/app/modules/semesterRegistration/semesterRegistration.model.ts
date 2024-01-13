import { Schema, model } from "mongoose";
import { semesterRegistrationStatus } from "./semesterRegistration.const";
import { TSemesterRegistration } from "./semesterRegistration.interface";

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
    {
        academicSemester: {
            type: Schema.Types.ObjectId,
            require: true,
            unique: true,
            ref: "Academic-semester"
        },
        status: {
            type: String,
            enum: semesterRegistrationStatus,
            default: "UPCOMING"
        },
        startDate: { type: Date, require: true },
        endDate: { type: Date, require: true },
        minCredit: { type: Number, default: 3 },
        maxCredit: { type: Number, default: 15 }
    },
    {
        timestamps: true
    }
)

export const SemesterRegistrationModel = model<TSemesterRegistration>('Semester-Registration', semesterRegistrationSchema)