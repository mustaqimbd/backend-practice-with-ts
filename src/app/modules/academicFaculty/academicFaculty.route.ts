import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { academicFacultyControllers } from "./academicFaculty.controller";
import academicFacultyValidationSchema from "./academicFaculty.validation";
import auth from "../../middlewares/auth";

const academicFacultyRoutes = Router()

academicFacultyRoutes.post(
    '/create-academic-faculty',
    validateRequest(academicFacultyValidationSchema),
    academicFacultyControllers.createAcademicFaculty
)

academicFacultyRoutes.get(
    '/get-academic-faculty/:id',
    academicFacultyControllers.getAcademicFaculty
)

academicFacultyRoutes.get(
    '/get-all-academic-faculty',
    auth(),
    academicFacultyControllers.getAllAcademicFaculty
)

academicFacultyRoutes.patch(
    '/update-academic-faculty/:id',
    validateRequest(academicFacultyValidationSchema),
    academicFacultyControllers.updateAcademicFaculty
)



export default academicFacultyRoutes