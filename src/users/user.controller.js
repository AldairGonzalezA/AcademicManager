import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";
import Course from "../course/course.model.js";
 
export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0} = req.query;
        const query = { estado: true};
 
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('courses', 'name teacher')
                .populate('courses.teacher', 'name surname')
        ])
 
        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error: error.message || error
        })
    }
}

export const getUserById = async (req, res) => {
    try {
 
        const { id } = req.params;
 
        const user = await User.findById(id);
 
        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario not found'
            })
        }
 
        res.status(200).json({
            success: true,
            user
        })
 
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const {id} = req.params;
        const {_id, email, password, ...data} = req.body; 
        

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'User update !!',
            user
        })
    } catch (error) {
        res.status(500).json({
            succccess: false,
            msg: 'Error to update user',
            error
        })
    }
}

export const updatePassword = async (req, res = response) => {
    try {
        const {id} = req.params;
        const {password} = req.body;
        const data = {};

        if(password){
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Password update!!',
            user
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error to update password',
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, {estado: false}, {new: true});
        const autheticatedUser = req.user;

        res.status(200).json({
            succes: true,
            msg: 'Usuario desactivado',
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al desactivar usuario',
            error
        })
    }
}

export const asignarCourse = async (req, res = response) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const courses = user.courses 
        const data = req.body;
        if(courses.length === 3){
            return res.status(404).json({
                success: false,
                msg:"Ya tiene asignados la cantidad maxima de cursos"
            })
        }
        const course = await Course.findOne({name: data.name})
        if(!course){
            return res.status(404).json({
                success: false,
                msg: "Curso no encontrado"
            })
        }
        if(courses.some((curso) => curso.name === data.name)){
            return res.status(404).json({
                success: false,
                msg: 'Ya se encuentra asignado a este curso'
            })
        }

        user.courses.push(course);
        course.students.push(user);
        await course.save();
        const asigned = await user.save()

        res.status(200).json({
            success: true,
            msg:'Se asigno al curso exitosamente',
            asigned
        })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:'Error to asigned to the course',
            error: error.message || error
        })
    }
}