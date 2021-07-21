const { validationResult } = require("express-validator")

/**
 * Middleware personalizado para revisar las validaciones de las rutas
 * y devolver los errores (si los hay) en un json. En caso de existir errores
 * no continua con la ejecución del siguiente middleware o controlador.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next Función que indica que se puede continuar con el siguiente middleware o controller
 * @returns 
 */
const validateRouteFields = ( req, res, next ) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json({
            result: false,
            errors
        });
    }

    //Indicamos que se puede pasar al siguiente middleware o controlador
    next();
}

module.exports = {
    validateRouteFields
}