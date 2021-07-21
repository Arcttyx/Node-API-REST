const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de los middleware utilizados
const { validateRouteFields } = require('../middlewares/route-fields-validator');

//Importaciones de los controladores utilizados
const { login } = require('../controllers/auth.controller');


/**
 * RUTAS PARA SERVICIOS RELACIONADOS CON AUTENTICACIÓN
 * 
 * Se definen los endpoints relacionados las funciones de autenticación
 * Se ocupan middlewares personalizados para validaciones de datos de entrada
 * Se ocupa el controlador auth con sus métodos que se ejecutan después de pasar por los middlewares
 * establecidos para cada endpoint
 */

const router = Router();

/**
 * Endpoint público para realizar la autenticación de un usuario
 * Se validan los datos obligatorios y su formato
 * Llama al método login del controlador de auth
 */
router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateRouteFields
], login);

//Se exportan los endpoints definidos para que se pueda acceder a los mismos
module.exports = router;