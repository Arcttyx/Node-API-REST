const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de los middleware utilizados
const { validateRouteFields } = require('../middlewares/route-fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');
const { isForAdminRole, isAnyOfTheseRoles } = require('../middlewares/role-validator');

//Importaciones de los helpers utilizados
const { isValidRole, isEmailAlreadyTaken, userExistsById } = require('../helpers/db-validators');

//Importaciones de los controladores utilizados
const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/users.controller');


/**
 * RUTAS PARA CRUD DE USUARIOS
 * 
 * Se definen los endpoints relacionados al modelo User
 * Se ocupan middlewares personalizados para validaciones de datos de entrada, JWT así como accesos por rol de usuario
 * Se ocupan helpers para validaciones de datos que requieren consultarse en BD
 * Se ocupa el controlador de usuarios con sus métodos que se ejecutan después de pasar por los middlewares
 * establecidos para cada endpoint
 */

const router = Router();

/**
 * Endpoint privado para listar todos los usuarios de forma paginada
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Llama al método usersGet del controlador de usuarios
 */
router.get('/', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
], usersGet);

/**
 * Endpoint privado para la creación de un usuario
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se validan los datos obligatorios y su formato
 * Se valida el dato de rol contra los valores registrados en el catálogo de roles en BD
 * Llama al método usersPost si pasó todos los middlewares definidos
 */
router.post('/', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( (email) => isEmailAlreadyTaken(email) ),
    //check('catalog_role_id', 'No es un rol válido').isIn(['ADMINISTRADOR', 'GERENTE', 'VENDEDOR', 'REPARTIDOR', 'CLIENTE']),
    check('catalog_role_id').custom( (catalog_role_id) => isValidRole(catalog_role_id) ),
    validateRouteFields
], usersPost);

/**
 * Endpoint privado para la actualización de un registro de usuario
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se verifica el formato del id recibido y su existencia en BD
 * Se valida el dato de rol contra los valores registrados en el catálogo de roles en BD
 * Llama al método usersPut si pasó todos los middlewares definidos
 */
router.put('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => userExistsById(id) ),
    check('catalog_role_id').custom( (catalog_role_id) => isValidRole(catalog_role_id) ),
    validateRouteFields
], usersPut);

/**
 * Endpoint privado para la eliminación de un usuario
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se verifica el formato del id recibido y su existencia en BD
 * Llama al método usersDelete si pasó todos los middlewares definidos
 */
router.delete('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => userExistsById(id) ),
    validateRouteFields
], usersDelete);


//Se exportan los endpoints definidos para que se pueda acceder a los mismos
module.exports = router;