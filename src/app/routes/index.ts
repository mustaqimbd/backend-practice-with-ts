import { enrolledCourseRoutes } from './../modules/enrolledCourse/enrolledCourse.route';
import { Router } from "express";
import userRoute from "../modules/user/user.route";
import studentRoute from "../modules/student/student.route";
import academicSemesterRoutes from "../modules/academicSemester/academicSemester.route";
import academicFacultyRoutes from "../modules/academicFaculty/academicFaculty.route";
import academicDepartmentRoutes from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { CourseRoutes } from "../modules/course/course.route";
import semesterRegistrationRoutes from "../modules/semesterRegistration/semesterRegistration.route";
import offeredCourseRoutes from "../modules/offeredCourse/offeredCourse.route";
import authRoutes from "../modules/auth/auth.route";

const router = Router()
const moduleRoutes = [
    {
        path: "/users",
        route: userRoute
    },
    {
        path: "/students",
        route: studentRoute
    },
    {
        path: '/faculties',
        route: FacultyRoutes,
    },
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: "/academic-semesters",
        route: academicSemesterRoutes
    },
    {
        path: "/academic-faculties",
        route: academicFacultyRoutes
    },
    {
        path: "/academic-departments",
        route: academicDepartmentRoutes
    },
    {
        path: "/courses",
        route: CourseRoutes
    },
    {
        path: "/semester-registration",
        route: semesterRegistrationRoutes
    },
    {
        path: "/offered-courses",
        route: offeredCourseRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/enrolled-courses",
        route: enrolledCourseRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router