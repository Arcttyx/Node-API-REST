const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

/**
 * Procesamiento de las peticiones POST referentes a la autenticación
 * Asume que ya se validaron los campos obligatorios desde auth.routes
 * Realiza la verificación de que el usuario con ese correo exista y que esté ACTIVO
 * así como que la contraseña enviada coincida con su cuenta
 * Regresa los datos del usuario y un token válido en caso de tener éxito
 */
const login = async(req, res = response) => {

    //Se reciben los cambios de la petición
    const { email, password } = req.body;

    try {
        //Verificar correo
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                result: false,
                msg: 'Usuario / Password no son correctos'
            });
        }

        //Revisar si el usuario está activo
        if (user.status != 'ACTIVO') {
            return res.status(400).json({
                result: false,
                msg: 'Usuario incativo'
            });
        }

        //Validar la contraseña
        const isValidPassword = bcryptjs.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                result: false,
                msg: 'Usuario / Password no son correctos.'
            });
        }

        //Generar el jwt
        const token =  await generateJWT( user.id );

        return res.json({
            result: true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            result: false,
            msg: 'Algo salió mal'
        });
    }
}

module.exports = {
    login
}