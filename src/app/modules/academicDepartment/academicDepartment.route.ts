import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { academicDepartmentControllers } from "./academicDepartment.controller";
import academicDepartmentValidationSchema from "./academicDepartment.validation";

const academicDepartmentRoutes = Router()

academicDepartmentRoutes.post(
    '/create-academic-department',
    // validateRequest(academicDepartmentValidationSchema),
    academicDepartmentControllers.createAcademicDepartment
)

academicDepartmentRoutes.get(
    '/get-academic-department/:id',
    academicDepartmentControllers.getAcademicDepartment
)

academicDepartmentRoutes.get(
    '/get-all-academic-department',
    academicDepartmentControllers.getAllAcademicDepartments
)

academicDepartmentRoutes.patch(
    '/update-academic-department/:id',
    validateRequest(academicDepartmentValidationSchema),
    academicDepartmentControllers.updateAcademicDepartment
)



export default academicDepartmentRoutes