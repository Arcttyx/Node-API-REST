const {Router} = require('express');

//Importaciones de los controladores utilizados
const { search } = require('../controllers/searches.controller');


/**
 * RUTAS PARA EL SERVICIO DE BÚSQUEDA DE DATOS EN COLECCIONES DE DATOS
 * 
 * Se definen los endpoints relacionados al servicio de búsqueda
 * Se ocupa el controlador searches con sus métodos que se ejecutan después de pasar por los middlewares
 * establecidos para cada endpoint
 */

const router = Router();

/**
 * Endpoint público que recibe y valida la petición para obtener todos los registros de un modelo que coincidan con un término de búsqueda
 * Llama al método search del controlador searches
 */
router.get('/:collection/:term', search);

//Se exportan los endpoints definidos para que se pueda acceder a los mismos
module.exports = router;