import { Router } from 'express';
import { login, registerTeachers, registerAlumns } from './auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { uploadProfilePicture } from '../middlewares/multer-upload.js';
import { deleteFileOnError } from '../middlewares/deleteFileOnError.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    login

);

router.post(
    '/registerAlumns',
    uploadProfilePicture.single("profilePicture"),
    registerValidator,
    deleteFileOnError,
    registerAlumns
);

router.post(
    "/registerTeachers",
    uploadProfilePicture.single("profilePicture"),
    registerValidator,
    deleteFileOnError,
    registerTeachers
)

export default router;