const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        //Conectar BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Definición de rutas de la aplicación
        this.routes();
    }

    async conectarDB() {
        //Aqui podría ir lógica para conectar a una u otro ambiente de BD
        //segun los env
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );

        //Serializar JSON cuando vengan por post
        this.app.use( express.json() );

        //Servir el directorio público
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.usersPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en ${this.port}`);
        });
    }
}

module.exports = Server;