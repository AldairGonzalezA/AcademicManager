export const tieneRol = (...roles) =>{
    return (req, res, next) =>{
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                msg: 'Is need to verify a role '
            })
        }
        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                msg:  `User is not authorized, his role is ${req.usuario.role}, the roles authorized are ${roles}`
            })
        }
        next();
    }
}