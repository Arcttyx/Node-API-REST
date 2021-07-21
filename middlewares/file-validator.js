const { response } = require("express");

/**
 * Función para validar la existencia de un archivo en la petición
 */
const validateUploadFile = (req, res = response, next) => {
    //Validamos que se haya envido un archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.uploadedFile) {
        return res.status(400).json({
            result: false,
            msg: 'No hay archivos por subir'
        });
    }

    //Indicamos que se puede pasar al siguiente middleware o controlador
    next();
}

module.exports = {
    validateUploadFile
}