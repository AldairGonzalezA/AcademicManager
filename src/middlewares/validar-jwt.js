import jwt from 'jsonwebtoken';
import Usuario from '../users/user.model.js';

export const validarJWT = async(req, res, next) => {
    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.satus(401).json({
                msg: 'Usuario no exixte en la base de datos'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg : 'Token no válido - usuario con estado: false'
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}