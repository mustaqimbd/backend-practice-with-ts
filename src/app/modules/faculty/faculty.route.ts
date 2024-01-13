import express from 'express';
import { FacultyControllers } from './faculty.controller';
import { updateFacultyValidationSchema } from './faculty.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLL } from '../user/user.const';

const router = express.Router();

router.get('/:id', FacultyControllers.getSingleFaculty);

router.get(
  '/',
  auth(USER_ROLL.admin, USER_ROLL.faculty),
  FacultyControllers.getAllFaculties
);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);



export const FacultyRoutes = router;
