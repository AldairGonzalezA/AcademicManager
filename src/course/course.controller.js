import { response, request } from "express";
import Course from './course.model.js'
import User from '../users/user.model.js'

export const saveCourse = async (req, res) =>{
    try {
        const data = req.body
        const user = await User.findOne({email: data.email})

        const course = await Course.create({
            name: data.name,
            description: data.description,
            teacher: user.id
        })

        await User.findByIdAndUpdate(user._id, {
            $push: { courses: course._id}
        })

        return res.status(200).json({
            message: 'Course registered successfully',
            couseDetails:{
                course: course.name
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            msg: 'Error to save the course', 
            error
        })
    }
}

export const getCourses = async (req = request, res = response) =>{
    try {
            const {limite = 10, desde = 0} = req.query;
            const query = { status: true};

            const[total, courses] = await Promise.all([
                Course.countDocuments(query),
                Course.find(query)
                    .skip(Number(desde))
                    .limit(Number(limite))
                    .populate('students', 'name surname')
            ])

            res.status(200).json({
                success: true,
                total,
                courses
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:"Error to gets the courses",
            error
        })
    }
}

export const getCourseById = async (req, res) =>{
    try {
        const { id } = req.params;
        const course = await Course.findById(id).populate([
            {path: 'students', select: 'name '}
        ]);
        if(!course){
            return res.status(404).json({
                success: false,
                msg:"Course not found"
            })
        }

        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:"Error to search the course",
            error: error.message
        })
    }
}

export const updateCourse = async (req, res = response) => {
    try {
        const { id } = req.params;
        const {_id, ...data} = req.body;
        const course = await Course.findByIdAndUpdate(id, data, {new: true});
        
        res.status(200).json({
            success: true,
            mesg:"Course update successfully",
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg:"Error to update the course",
            error
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const authoticateUser = req.usuario;
        if(authoticateUser.role === "TEACHER_ROLE"){
            const course = await Course.findByIdAndUpdate(id, {status: false}, {new: true});
            const students = await course.students;
            for(let studentId of students){
                await User.findByIdAndUpdate(studentId, {
                    $pull: {courses: course._id}
                });
                await Course.findByIdAndUpdate(id, {
                    $pull: {students: studentId}
                });
            }

            return res.status(200).json({
                success: true,
                msg: 'Curso desactivado exitosamente',
                course,
                authoticateUser
            });
        }
        
        return res.status(403).json({
            success: false,
            msg: 'Solo un usuario con TEACHER_ROLE puede eliminar el curso'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg:"Error to delete the course",
            error: error.message
        })
    }
}