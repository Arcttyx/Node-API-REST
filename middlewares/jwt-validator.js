const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {
    //El token usualmente se recibe en los headers de a petición
    //entonces o extraemos de allí
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        //console.log(payload);

        //leer el usuario corresponde al uid
        //Agregamos la info del usuario a los valores de la request para que también
        //este disponible en los siguientes moddlewares y controlares
        //En este caso lo usará el middleware role-validator, user.controller::usersDelete
        user = await User.findById( uid );

        //Validar que el usuario existe
        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no válido, usuario no existe'
            });
        }

        //Validar que el usuario verificado este activo
        if ( user.status != 'ACTIVO' ) {
            return res.status(401).json({
                msg: 'Token no válido, usuario no activo'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}


module.exports = {
    validateJWT
}