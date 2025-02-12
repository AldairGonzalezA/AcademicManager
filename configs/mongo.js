'use strict'

import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error',()=>{
            console.log('MongoDB  could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting',()=>{
            console.log('MongoDB Try connection');
        });
        mongoose.connection.on('connected',()=>{
            console.log('MongoDB connected to MongoDB');
        });
        mongoose.connection.on('open',()=>{
            console.log('MongoDB connected to database');
        });
        mongoose.connection.on('reconnected',()=>{
            console.log('MongoDB reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected',()=>{
            console.log('MongoDB disconnected');
        });

        await mongoose.connect(process.env.URT_MONGO,{
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    } catch (error) {
        console.log('Database conmection failed'.error);
    }
}