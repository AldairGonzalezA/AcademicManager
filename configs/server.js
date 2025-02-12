'use strict'

import express, { application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{

}

const connectarDB = async () =>{
    try {
        await dbConnection();
        console.log('Conexión exitosa con la base de datos');        
    } catch (error) {
        console.log('Error al conectar con la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        connectarDB();
        routes(app);
        app.listen(port);   
        console.log(`Server running on port ${port}`);
    } catch (err) {
        console.log(`Server init failerd ${err}`);
    }
}