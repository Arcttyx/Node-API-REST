const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de los middleware utilizados
const { validateJWT } = require('../middlewares/jwt-validator');
const { isAnyOfTheseRoles } = require('../middlewares/role-validator');
const { validateRouteFields } = require('../middlewares/route-fields-validator');

//Importaciones de los helpers utilizados
const { categoryExistsById } = require('../helpers/db-validators');

//Importaciones de los controladores utilizados
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller');


/**
 * RUTAS PARA CRUD DE CATEGORIAS
 * 
 * Se definen los endpoints relacionados al modelo Category
 * Se ocupan middlewares personalizados para validaciones de datos de entrada, JWT así como accesos por rol de usuario
 * Se ocupan helpers para validaciones de datos que requieren consultarse en BD
 * Se ocupa el controlador de categorías con sus métodos que se ejecutan después de pasar por los middlewares
 * establecidos para cada endpoint
 */

const router = Router();

/**
 * Endpoint público que recibe y valida la petición para obtener todas las categorías de forma paginada
 * Llama al método getCategories del controlador de categorías
 */
router.get('/', getCategories);

/**
 * Endpoint público que recibe y valida la petición para obtener una categoría por id
 * Se verifica el formato del id recibido y su existencia en BD
 * Llama al método getCategory del controlador de categorías
 */
router.get('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => categoryExistsById(id) ),
    validateRouteFields
], getCategory);

/**
 * Endpoint privado que recibe y valida la petición para crear una categoría
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se validan los datos obligatorios y su formato
 * Llama al método createCategory del controlador de categorías
 */
router.post('/', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateRouteFields
], createCategory);

/**
 * Endpoint privado que Recibe y valida la petición para actualizar un producto
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se verifica el formato del id recibido y su existencia en BD
 * Se valida el formato de los datos recibidos
 * Llama al método updateCategory del controlador de categorías
 */
router.put('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => categoryExistsById(id) ),
    validateRouteFields
], updateCategory);

/**
 * Endpoint privado que recibe y valida la petición para eliminar una categoría
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se verifica el formato del id recibido y su existencia en BD
 * Llama al método deleteCategory del controlador de categorías
 */
 router.delete('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => categoryExistsById(id) ),
    validateRouteFields
 ], deleteCategory);

//Se exportan los endpoints definidos para que se pueda acceder a los mismos
module.exports = router;