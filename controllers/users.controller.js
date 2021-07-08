const { response, request } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

/**
 * Procesamiento para obtener los egistros del modelo User de forma paginada
 * @param {*} req 
 * @param {*} res 
 */
const usersGet = async(req = request, res = response) => {

    const { limit = 5, skip = 0 } = req.query;
    const whereConditions = { status: "ACTIVO" }

    //Arreglo de promesas con desestructuracion posicional
    //Primero se hace la llamada para saber el total y luego para traer los registros
    //en el mismo await, en vez de hacer dos (lo que lo haría más lento por separado)
    const [ totalUsers, users ] = await Promise.all([
        User.countDocuments(whereConditions),

        User.find(whereConditions)
        .limit(Number(limit))
        .skip(Number(skip))
    ]);

    res.json({
        result: true,
        totalUsers,
        users
    });
}

/**
 * Procesamiento de las peticiones POST referentes al modelo User
 * Asume que ya se validaron los campos obligatorios desde user.routes
 * así como la validación unique del correo
 * @param {*} req 
 * @param {*} res 
 */
const usersPost = async(req, res = response) => {

    //Obtenemos de forma destructurada los argumentos que venagn del POST
    const {catalog_role_id,name,paternal_last_name,maternal_last_name,phone,level,email,password} = req.body;
    const user = new User({catalog_role_id,name,paternal_last_name,maternal_last_name,phone,level,email,password});

    //Así sería si no queremos poner tdos los campos y solo excluir los que no queremos
    // const {status, is_auth_google, created_at, updated_at, ...resto} = req.body;
    // const user = new User(resto);

    //Cifrar la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    //Guardar el regstro en BD
    await user.save();

    //Se manda de respuesta el resultado de la operación y el usuario convertido a json
    res.json({
        result: true,
        user
    });
}


/**
 * Procesamiento de las peticiones PUT referentes al modelo User
 * Asume que ya se validaron los campos obligatorios desde user.routes
 * así como que el id recibidoen los parámetros de la ruta sea un id de mongo válido
 * @param {*} req 
 * @param {*} res 
 */
const usersPut = async(req, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Obtenemos de forma destructurada los argumentos que vengan del PUT
    //Quitamos el _id de mongo (si es que viniera), prque en teoría lo estamos obteniendo del parámetro de la ruta
    //Quitamos el tipo de autenticaci´ón porque no queremos que se pueda actualizar
    const { _id, password, is_auth_google, email, ...userData } = req.body;

    //Si viene password, quiere actualizarlo, hay que cifrarlo nuevamente
    if (password) {
        const salt = bcrypt.genSaltSync();
        userData.password = bcrypt.hashSync(password, salt);
    }

    //Actualizar la información del usuario
    userData.updated_at = Date.now();
    const user = await User.findByIdAndUpdate(id, userData);

    res.json({
        result: true,
        user
    });
}

const usersDelete = async(req, res = response) => {
    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Borrado físico
    //const user = await User.findByIdAndDelete(id);

    //Borrado lógico
    const user = await User.findByIdAndUpdate(id, {status: "INACTIVO"});

    //Se recupera el usuario autenticado de la request
    const autenticatedUser = req.user;

    res.json({
        result: true,
        user,
        autenticatedUser
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usersPatch'
    });
}



module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
}