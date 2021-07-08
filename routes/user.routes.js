const { Router } = require('express');
const { check } = require('express-validator');

const { validateRouteFields } = require('../middlewares/route-fields-validator');
const { isValidRole, isEmailAlreadyTaken, userExistsById } = require('../helpers/db-validators');

const { usersGet, usersPut, usersPost, usersDelete } = require('../controllers/users.controller');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => userExistsById(id) ),
    check('catalog_role_id').custom( (catalog_role_id) => isValidRole(catalog_role_id) ),
    validateRouteFields
], usersPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( (email) => isEmailAlreadyTaken(email) ),
    //check('catalog_role_id', 'No es un rol válido').isIn(['ADMINISTRADOR', 'GERENTE', 'VENDEDOR', 'REPARTIDOR', 'CLIENTE']),
    check('catalog_role_id').custom( (catalog_role_id) => isValidRole(catalog_role_id) ),
    validateRouteFields
], usersPost);

router.delete('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom( (id) => userExistsById(id) ),
    validateRouteFields
], usersDelete);

module.exports = router;