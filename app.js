//Importaciones propias de node

//Importaciones de paquetes de terceros
require('dotenv').config();

//Nuestros archivos
const Server = require('./models/server');

const server = new Server();
server.listen();