import { Schema, model } from "mongoose";
import { Days } from "./offeredCourse.const";
import { TOfferedCourse } from "./offeredCourse.interface";

const offeredCoursesSchema = new Schema<TOfferedCourse>({
    semesterRegistration: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Semester-Registration"
    },
    academicSemester: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Academic-semester"
    },
    academicFaculty: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Academic-faculty"
    },
    academicDepartment: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Academic-department"
    },
    course: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Course"
    },
    faculty: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Faculty"
    },
    section: { type: Number, required: true },
    maxCapacity: {
        type: Number,
        require: true,
        default: 30
    },
    days: [{ type: String, enum: Days }],
    startTime: {
        type: String,
        require: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
        type: String,
        require: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
})

export const OfferedCourseModel = model<TOfferedCourse>('Offered-Course', offeredCoursesSchema)