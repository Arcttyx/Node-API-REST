const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de los middleware utilizados
const { validateJWT } = require('../middlewares/jwt-validator');
const { isAnyOfTheseRoles } = require('../middlewares/role-validator');
const { validateRouteFields } = require('../middlewares/route-fields-validator');

//Importaciones de los helpers utilizados
const { productExistsById, categoryExistsById } = require('../helpers/db-validators');

//Importaciones de los controladores utilizados
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');


/**
 * RUTAS PARA CRUD DE PRODUCTOS
 * 
 * Se definen los endpoints relacionados al modelo Product
 * Se ocupan middlewares personalizados para validaciones de datos de entrada, JWT así como accesos por rol de usuario
 * Se ocupan helpers para validaciones de datos que requieren consultarse en BD
 * Se ocupa el controlador de productos con sus métodos que se ejecutan después de pasar por los middlewares
 * establecidos para cada endpoint
 */

const router = Router();

/**
 * Endpoint público que recibe y valida la petición para obtener todos los productos de forma paginada
 * Llama al método getProducts del controlador de productos
 */
router.get('/', getProducts);

/**
 * Endpoint público que recibe y valida la petición para obtener un producto por id
 * Se verifica el formato del id recibido y su existencia en BD
 * Llama al método getProduct del controlador de productos
 */
router.get('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => productExistsById(id) ),
    validateRouteFields
], getProduct);

/**
 * Endpoint privado que recibe y valida la petición para crear un producto
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se validan los datos obligatorios y su formato
 * Se verifica el formato del id de categoría recibido y su validez y existencia en BD
 * Llama al método createProduct del controlador de productos
 */
router.post('/', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripción no puede ser mayor a 100 caracteres').optional().isLength({ max: 100 }),
    check('price', 'El precio debe ser un número positivo').isFloat({ min:0 }),
    check('discount', 'El descuento debe ser un porcentaje positivo').optional().isFloat({ min:0 }),
    check('unit_type', 'No es una unidad válida').isIn(['UNIDAD', 'KILO']),
    check('status', 'No es un estatus válido').isIn(['DISPONIBLE', 'AGOTADO', 'ELIMINADO', 'DESHABILITADO']),
    check('catalog_product_category_id', 'No es un identificador válido').isMongoId(),
    check('catalog_product_category_id').custom( (catalog_product_category_id) => categoryExistsById(catalog_product_category_id) ),
    validateRouteFields
], createProduct);

/**
 * Endpoint privado que Recibe y valida la petición para actualizar un producto
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se verifica el formato del id recibido y su existencia en BD
 * Se valida el formato de los datos recibidos
 * Se verifica el formato del id de categoría recibido y su validez y existencia en BD
 * Llama al método updateProduct del controlador de productos
 */
router.put('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => productExistsById(id) ),
    check('price', 'El precio debe ser un número positivo').optional().isFloat({ min:0 }),
    check('discount', 'El descuento debe ser un porcentaje positivo').optional().isFloat({ min:0 }),
    check('unit_type', 'No es una unidad válida').optional().isIn(['UNIDAD', 'KILO']),
    check('status', 'No es un estatus válido').optional().isIn(['DISPONIBLE', 'AGOTADO', 'ELIMINADO', 'DESHABILITADO']),
    check('catalog_product_category_id', 'No es un identificador válido').optional().isMongoId(),
    check('catalog_product_category_id').optional().custom( (catalog_product_category_id) => categoryExistsById(catalog_product_category_id) ),
    validateRouteFields
], updateProduct);

/**
 * Endpoint privado que recibe y valida la petición para eliminar un producto
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se verifica el formato del id recibido y su existencia en BD
 * Llama al método deleteProduct del controlador de productos
 */
 router.delete('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => productExistsById(id) ),
    validateRouteFields
 ], deleteProduct);

//Se exportan los endpoints definidos para que se pueda acceder a los mismos
module.exports = router;