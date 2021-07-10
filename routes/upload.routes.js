const { Router } = require('express');
const { check } = require('express-validator');
const { loadFile, fileUpdate, getFile } = require('../controllers/uploads');
const { isCollectionAllowed } = require('../helpers/db-validators');
const { validateUploadFile } = require('../middlewares/file-validator');

const { validateRouteFields } = require('../middlewares/route-fields-validator');

const router = Router();


//Para subir un archivo al directorio default de la aplicación
router.post('/', [
    validateUploadFile,
    validateRouteFields
], loadFile);


//Para subir/actualizar la imagen de un usuario o producto por id
router.put('/:collection/:id', [
    validateUploadFile,
    check('id', 'No es un identificador válido').isMongoId(),
    check('collection').custom( c => isCollectionAllowed(c, ['users', 'products']) ),
    validateRouteFields
], fileUpdate);


//Para poder servir la imagen de un usuario o producto por id
router.get('/:collection/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('collection').custom( c => isCollectionAllowed(c, ['users', 'products']) ),
    validateRouteFields
], getFile);

module.exports = router;