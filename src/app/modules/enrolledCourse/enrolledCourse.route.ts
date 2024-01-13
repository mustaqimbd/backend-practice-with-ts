import { Router } from "express";
import { enrolledCourseControllers } from "./enrolledCourse.controller";
import { createEnrolledCourseValidationZodSchema, updateEnrolledCourseMarksValidationZodSchema } from "./enrolledCourse.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = Router()

router.post(
    '/create-enrolled-course',
    auth('student'),
    validateRequest(createEnrolledCourseValidationZodSchema),
    enrolledCourseControllers.createEnrolledCourse
)
router.patch(
    '/update-enrolled-course-marks',
    auth('faculty',"admin"),
    validateRequest(updateEnrolledCourseMarksValidationZodSchema),
    enrolledCourseControllers.updateEnrolledCourseMark
)

export const enrolledCourseRoutes = router