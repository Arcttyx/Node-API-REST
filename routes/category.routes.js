const { Router } = require('express');
const { check } = require('express-validator');

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller');
const { categoryExistsById } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/jwt-validator');
const { isAnyOfTheseRoles } = require('../middlewares/role-validator');

const { validateRouteFields } = require('../middlewares/route-fields-validator');

const router = Router();

/**
 * Recibe y valida la petición para obtener todas las categorías
 * Es público
 */
router.get('/', getCategories);

/**
 * Recibe y valida la petición para obtener todas una categoría
 * Es público
 */
router.get('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => categoryExistsById(id) ),
    validateRouteFields
], getCategory);

/**
 * Recibe y valida la petición para crear las categorías
 * Es privado, por token válido
 */
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateRouteFields
], createCategory);

/**
 * Recibe y valida la petición para actualizar una categoría
 * Es privado
 */
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => categoryExistsById(id) ),
    validateRouteFields
], updateCategory);

/**
 * Recibe y valida la petición para eliminar una categoría
 * Es privado y solo para ADMINISTRADOR o GERENTE
 */
 router.delete('/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => categoryExistsById(id) ),
    validateRouteFields
 ], deleteCategory);

module.exports = router;