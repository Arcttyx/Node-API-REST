const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de los middleware utilizados
const { validateJWT } = require('../middlewares/jwt-validator');
const { isAnyOfTheseRoles } = require('../middlewares/role-validator');
const { validateUploadFile } = require('../middlewares/file-validator');
const { validateRouteFields } = require('../middlewares/route-fields-validator');

//Importaciones de los helpers utilizados
const { isCollectionAllowed } = require('../helpers/db-validators');

//Importaciones de los controladores utilizados
const { loadFile, fileUpdate, getFile } = require('../controllers/uploads.controller');


/**
 * RUTAS PARA EL MANEJO DE ARCHIVOS
 * 
 * Se definen los endpoints relacionados al manejo de archivos/imágenes
 * Se ocupan middlewares personalizados para validaciones de datos de entrada, de archivo, JWT así como accesos por rol de usuario
 * Se ocupan helpers para validaciones de datos que requieren consultarse en BD
 * Se ocupa el controlador uploads con sus métodos que se ejecutan después de pasar por los middlewares
 * establecidos para cada endpoint
 */

const router = Router();

/**
 * Endpoint privado que recibe y valida la petición para subir un archivo al directorio default de la aplicación
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se valida la extensión del archivo
 * Llama al método loadFile del controlador uploads
 */
router.post('/', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    validateUploadFile,
    validateRouteFields
], loadFile);

/**
 * Endpoint para subir/actualizar la imagen de un usuario o producto
 * Se requiere un token activo y un perfil de Admin o Gerente para poder acceder
 * Se valida la extensión del archivo
 * Se verifica el formato del id recibido y su existencia en BD
 * Se valida la colección/modelo recibido
 * Llama al método fileUpdate del controlador uploads
 */
router.put('/:collection/:id', [
    validateJWT,
    isAnyOfTheseRoles('ADMINISTRADOR', 'GERENTE'),
    validateUploadFile,
    check('id', 'No es un identificador válido').isMongoId(),
    check('collection').custom( c => isCollectionAllowed(c, ['users', 'products']) ),
    validateRouteFields
], fileUpdate);

/**
 * Endpoint público para servir la imagen del modelo usuario/producto por id
 * Se verifica el formato del id recibido y su existencia en BD
 * Se valida que la colección pertenezca a una de las permitidas
 * Llama al método getFile del controlador uploads
 */
router.get('/:collection/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('collection').custom( c => isCollectionAllowed(c, ['users', 'products']) ),
    validateRouteFields
], getFile);

//Se exportan los endpoints definidos para que se pueda acceder a los mismos
module.exports = router;