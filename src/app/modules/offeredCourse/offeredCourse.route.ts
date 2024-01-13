import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import { offeredCoursesValidationSchema, updateOfferedCoursesValidationSchema } from "./offeredCourse.validation";

const offeredCourseRoutes = Router()

offeredCourseRoutes.post(
    '/',
    validateRequest(offeredCoursesValidationSchema),
    OfferedCourseControllers.createOfferedCourse
)

offeredCourseRoutes.get(
    '/',
    OfferedCourseControllers.getAllOfferedCourses
)

offeredCourseRoutes.get(
    '/:id',
    OfferedCourseControllers.getSingleOfferedCourse
)

offeredCourseRoutes.patch(
    '/:id',
    validateRequest(updateOfferedCoursesValidationSchema),
    OfferedCourseControllers.updateOfferedCourse
)

offeredCourseRoutes.delete(
    '/:id',
    OfferedCourseControllers.deleteOfferedCourse
)

export default offeredCourseRoutes