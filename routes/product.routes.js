const { Router } = require('express');
const { check } = require('express-validator');

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { productExistsById, categoryExistsById } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/jwt-validator');
const { isAnyOfTheseRoles } = require('../middlewares/role-validator');

const { validateRouteFields } = require('../middlewares/route-fields-validator');

const router = Router();

/**
 * Recibe y valida la petición para obtener todas las categorías
 * Es público
 */
router.get('/', getProducts);

/**
 * Recibe y valida la petición para obtener todas una categoría
 * Es público
 */
router.get('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => productExistsById(id) ),
    validateRouteFields
], getProduct);

/**
 * Recibe y valida la petición para crear las categorías
 * Es privado, por token válido
 */
router.post('/', [
    validateJWT,
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
 * Recibe y valida la petición para actualizar una categoría
 * Es privado
 */
router.put('/:id', [
    validateJWT,
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
 * Recibe y valida la petición para eliminar una categoría
 * Es privado y solo para ADMINISTRADOR o GERENTE
 */
 router.delete('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => productExistsById(id) ),
    validateRouteFields
 ], deleteProduct);

module.exports = router;