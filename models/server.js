const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        this.middlewares();

        //Definición de rutas de la aplicación
        this.routes();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );

        //Serializar JSON cuando vengan por post
        this.app.use( express.json() );

        //Servir el durectorio público
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