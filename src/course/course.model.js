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
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    students:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
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