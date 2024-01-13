import { z } from "zod";

const academicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: "Academic department is required",
            invalid_type_error: "Academic department be a string"
        }),
        academicFaculty: z.string({
            required_error: "Academic faculty is required",
            invalid_type_error: "Academic faculty must be a string"
        })
    })
})

export default academicDepartmentValidationSchema