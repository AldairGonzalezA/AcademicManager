import { Router } from "express";
import { check } from 'express-validator';
import { getCourses, getCourseById, saveCourse, updateCourse, deleteCourse } from "./course.controller.js";
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRol } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        tieneRol("TEACHER_ROLE"),
        validarCampos
    ],
    saveCourse
)

router.get("/".getCourses)

router.get(
    "/findCourse/:id",
    [
        validarJWT,
        tieneRol("TEACHER_ROLE"),
        check("id", "ID is not valid").isMongoId(),
        validarCampos
    ],
    getCourseById
)

router.put(
    "/:id",
    [
        tieneRol("TEACHER_ROLE"),
        check("id", "ID is invalid").isMongoId(),
        //check("id")custom(existeCourseById),
        validarCampos
    ],
    updateCourse
)

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRol("TEACHER_ROLE"),
        check("id", "ID is invalid").isMongoId(),
        validarCampos
    ],
    deleteCourse
)