const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config.db');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.searchPath = '/api/search';
        this.usersPath = '/api/users';
        this.categoriesPath = '/api/categories';
        this.productsPath = '/api/products';
        this.authPath = '/api/auth';
        this.uploadsPath = '/api/uploads';

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

        //Manejo de carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true  //Peligroso, pero con rutas controladas
        }));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.uploadsPath, require('../routes/upload.routes'));
        this.app.use(this.searchPath, require('../routes/search.routes'));
        this.app.use(this.usersPath, require('../routes/user.routes'));
        this.app.use(this.categoriesPath, require('../routes/category.routes'));
        this.app.use(this.productsPath, require('../routes/product.routes'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en ${this.port}`);
        });
    }
}

module.exports = Server;