import express from "express";
import { studentController } from "./student.controller";
import { validateRequestWithJoi } from "../../middlewares/validateRequest";
import { updateJoyStudentValidationSchema } from "./student.validation";
import auth from "../../middlewares/auth";

const studentRoute = express.Router()

studentRoute.get('/all-students', studentController.getAllStudents)

studentRoute.get(
    '/:id',
    auth('student', 'admin', "faculty"),
    studentController.getSingleStudents
)

studentRoute.patch(
    '/:id',
    validateRequestWithJoi(updateJoyStudentValidationSchema),
    studentController.updateStudent
)

studentRoute.delete('/:id', studentController.deleteAStudent)

export default studentRoute