const path = require('path');
const { v4: uuidv4 } = require('uuid');

const defaultExtensions = ['png', 'jpg', 'jpeg'];
//const allowedDirOutputs = ['users', 'products'];

const fileUpload = ( files, validExtensions = defaultExtensions, outputDirectory = '' ) => {

    return new Promise( (resolve, reject) => {
        //Obtenemos el archivo que se envió
        const { uploadedFile } = files;

        //Validar la extensión del archivo contra las permitidas que definamos
        const filename = uploadedFile.name.split('.');
        const extension = filename[ filename.length -1 ];
        if (!validExtensions.includes(extension)) {
            return reject(`La extensión ${extension} no es válida`);
        }

        // if (outputDirectory && !allowedDirOutputs.includes(outputDirectory)) {
        //     return reject(`El directorio ${outputDirectory} especificado no es váido`);
        // }

        //Renombrar archivo de forma única usando uuid package
        const tempName = uuidv4() + '.' + extension;

        //Definir la ruta donde se guardará el archivo
        const uploadPath = path.join(__dirname, '../uploads/', outputDirectory, tempName);

        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            //Devolvemos el nombre del archivo final para que el fron lo pueda buscar
            //en directorios públicos
            resolve(tempName);
        });
    });
}


module.exports = {
    fileUpload
}