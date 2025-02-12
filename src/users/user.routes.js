import { Router } from "express";
import { check} from "express-validator";
import  {getUsers, getUserById, updateUser, deleteUser, updatePassword } from "./user.controller.js";
import { existeUserById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { uploadProfilePicture} from "../middlewares/multer-upload.js";
import { validarJWT} from "../middlewares/validar-jwt.js"

const router = Router();

router.get("/", getUsers)

router.get(
    "/findUser/:id",
    [
        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeUserById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    uploadProfilePicture.single('profilePicture'),
    [
        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeUserById),
        validarCampos
    ],
    updateUser
)

router.put(
    "/updatePassword/:id",
    [
        validarJWT,
        check("id", "ID is not valid").isMongoId(),
        validarCampos
    ],
    updatePassword
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "id is invalid").isMongoId(),
        check("id").custom(existeUserById),
        validarCampos
    ],
    deleteUser
)

export default router;