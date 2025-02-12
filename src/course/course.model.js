import { Schema, model } from "mongoose";

const CourseSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
    },
    description:{
        type: String,
        required: [true, 'Description is required']
    },
    status:{
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Course', CourseSchema);