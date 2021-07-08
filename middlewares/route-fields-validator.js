const { validationResult } = require("express-validator")

/**
 * Middleware personalizado para revisar las validaciones de las rutas
 * y devolver los errores (si los hay) en un json. En caso de existir errores
 * no continua con la ejecución del siguiente middleware o controlador.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateRouteFields = ( req, res, next ) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validateRouteFields
}