import { z } from "zod"
import { Months, SemesterCodes, SemesterNames } from "./academicSemester.model"

const academicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...SemesterNames] as [string, ...string[]]),
        code: z.enum([...SemesterCodes] as [string, ...string[]]),
        year: z.string(),
        startMonth: z.enum([...Months] as [string, ...string[]]),
        endMonth: z.enum([...Months] as [string, ...string[]])
    })
})

const updateAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...SemesterNames] as [string, ...string[]]).optional(),
        code: z.enum([...SemesterCodes] as [string, ...string[]]).optional(),
        year: z.string().optional(),
        startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
        endMonth: z.enum([...Months] as [string, ...string[]]).optional()
    })
})

export {
    academicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema
} 