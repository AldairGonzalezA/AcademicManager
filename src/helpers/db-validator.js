import courseModel from '../course/course.model.js';
import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Course from '../course/course.model.js';

export const esRoleValido = async (role = '') => {
    
    const existeRol = await Role.findOne({role});

    if(!existeRol){
        throw new Error(`El rol ${role} no existe en la base de datos`);
    }
}

export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe en la base de datos`);
    }
}

export const existeUserById = async (id= '') => {
    const existUser = await User.findById(id);

    if (!existUser) {
        throw new Error(`El usuario con el id ${id} no existe en la base de datos`)
    }
}

export const existeCourseById = async (id = '') =>{
    const existeCourse = await Course.findById(id);

    if(!existeCourse){
        throw new Error(`El courso con el id ${id} no existe en la base de datos`);
    }
}
