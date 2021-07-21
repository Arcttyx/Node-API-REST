const { response, request } = require('express');
const jwt = require('jsonwebtoken');

//Importaciones de modelos necesarios
const User = require('../models/user');

/**
 * Función que valida un token recibido en una petición
 * Y agrega al request la información del usuario que hizo la petición
 * para que este disponible a los siguientes middlewares y controladores
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateJWT = async(req = request, res = response, next) => {
    //El token usualmente se recibe en los headers de la petición
    //entonces lo extraemos de allí con el nombre de x-token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        //Verificar la validez del token
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        //console.log(payload);

        //leer el usuario corresponde al uid
        user = await User.findById( uid );

        //Validar que el usuario existe
        if ( !user ) {
            return res.status(401).json({
                result: false,
                msg: 'Token no válido, usuario no existe'
            });
        }

        //Validar que el usuario verificado este activo
        if ( user.status != 'ACTIVO' ) {
            return res.status(401).json({
                result: false,
                msg: 'Token no válido, usuario no activo'
            });
        }

        //Agregamos la info del usuario a los valores de la request para que también
        //este disponible en los siguientes middlewares y controladores
        req.user = user;

        //Indicamos que se puede pasar al siguiente middleware o controlador
        next();
    } catch (error) {
        //console.log(error);
        return res.status(401).json({
            result: false,
            msg: 'Token no válido',
            error: error
        });
    }
}


module.exports = {
    validateJWT
}