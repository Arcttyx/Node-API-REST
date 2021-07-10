const { response } = require("express");

const validateUploadFile = (req, res = response, next) => {
    //Validamos que se haya envido un archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.uploadedFile) {
        return res.status(400).json({
            msg: 'No hay archivos por subir'
        });
    }

    next();
}

module.exports = {
    validateUploadFile
}