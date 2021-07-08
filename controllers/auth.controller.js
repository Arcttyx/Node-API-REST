const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

/**
 * Procesamiento de las peticiones POST referentes a la autenticación
 * Asume que ya se validaron los campos obligatorios desde auth.routes
 */
const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar correo
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        //Revisar si el usuario está activo
        if (user.status != 'ACTIVO') {
            return res.status(400).json({
                msg: 'Usuario incativo'
            });
        }

        //Validar la contraseña
        const isValidPassword = bcryptjs.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
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
            msg: 'Algo salió mal'
        });
    }
}

module.exports = {
    login
}