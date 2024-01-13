import { Router } from "express";
import { semesterRegistrationControllers } from "./semesterRegistration.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { semesterRegistrationValidationSchema, updateSemesterRegistrationValidationSchema } from "./semesterRegistration.validation";

const semesterRegistrationRoutes = Router()

semesterRegistrationRoutes.post(
    '/',
    validateRequest(semesterRegistrationValidationSchema),
    semesterRegistrationControllers.createSemesterRegistration
)

semesterRegistrationRoutes.get(
    '/',
    semesterRegistrationControllers.getSemesterRegistration
)

semesterRegistrationRoutes.get(
    '/:id',
    semesterRegistrationControllers.getSingleSemesterRegistration
)

semesterRegistrationRoutes.patch(
    '/:id',
    validateRequest(updateSemesterRegistrationValidationSchema),
    semesterRegistrationControllers.updateSemesterRegistration
)

export default semesterRegistrationRoutes