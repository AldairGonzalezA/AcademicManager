import jwt from 'jsonwebtoken';
import Usuario from '../users/user.model.js';

export const extraerJWT = async (req, res, next) =>{
    const token =req.header('x-token');
    try {
        const _token = token.split(" ")[1];
        const decoded = jwt.verify(_token, process.env.SECRETORPRIVATEKEY);



    } catch (error) {
        res.status(500).json({
            success: false,
            msg:"Error internal server",
            error: error.message
        })
    }
}

// Falta verificar