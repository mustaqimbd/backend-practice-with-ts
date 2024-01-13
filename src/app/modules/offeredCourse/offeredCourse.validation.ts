import { z } from "zod";
import { Days } from "./offeredCourse.const";

const timeSchema = z.string().refine((value) => {
    // Check if the value matches the regex pattern
    const pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return pattern.test(value);
}, 'Invalid time format');

const compareTimes = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    return end > start;
};

const offeredCoursesValidationSchema = z.object({
    body: z.object({
        semesterRegistration: z.string().min(1),
        academicFaculty: z.string().min(1),
        academicDepartment: z.string().min(1),
        course: z.string().min(1),
        faculty: z.string().min(1),
        section: z.number().min(1),
        maxCapacity: z.number().positive({ message: "Max capacity must be a positive number" }).min(1),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeSchema,
        endTime: timeSchema,
    }).refine(({startTime,endTime}) => {
        return compareTimes(startTime,endTime);
    }, {
        message: 'End time must be after start time',
    })
})



const updateOfferedCoursesValidationSchema = z.object({
    body: z.object(
        {
            faculty: z.string().min(1),
            maxCapacity: z.number().positive({ message: "Max capacity must be a positive number" }).min(1),
            days: z.array(z.enum([...Days] as [string, ...string[]])),
            startTime: timeSchema,
            endTime: timeSchema,
        }
    ).refine(({ startTime, endTime }) => {
        return compareTimes(startTime, endTime);
    }, {
        message: 'End time must be after start time',
    })
})

export { offeredCoursesValidationSchema, updateOfferedCoursesValidationSchema };
