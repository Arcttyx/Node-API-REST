//Importaciones de módulos propios de node
const path = require('path');
const fs = require('fs');

//Importaciones de dependencias de terceros
const { response } = require("express");

//Importaciones de helpers propios
const { fileUpload } = require("../helpers/file-utilities");

//Importaciones de modelos
const Product = require("../models/product");
const User = require("../models/user");


/**
 * Para subir cualquier archivo al directorio default
 * Devuelve la ruta donde se alojó el archivo
 */
const loadFile = async(req, res = response) => {
    try {
        const filePath = await fileUpload(req.files, undefined, '');
        return res.json({
            result: true,
            fileName: filePath
        });
    } catch (error) {
        return res.status(400).json({
            result: false,
            msg: error
        });
    }
}


/**
 * Para subir/actualizar una imagen en un objeto de un modelo (Usuario/Producto/...) en su atributo 'img'
 * el cual debe existir en la colección
 * Se valida que el registro con el id recibido de la colección recibida exista
 * Reemplaza la imagen anterior (en caso de existir)
 */
const fileUpdate = async(req, res = response) => {
    const {id, collection} = req.params;
    
    let objectModel;

    //Validaciones por colección
    switch (collection) {
        case 'users':
            objectModel = await User.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    result: false,
                    msg: 'No existe usuario con ese id'
                });
            }
            break;
        case 'products':
            objectModel = await Product.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    result: false,
                    msg: 'No existe producto con ese id'
                });
            }
            break;
        default:
            return res.status(500).json({ result: false, msg: 'No implementado' });
    }

    //Limpiar imágen previa
    if (objectModel.img) {
        const filepath = path.join(__dirname, '../uploads', collection, objectModel.img);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }

    //Subir nueva imagen y actualizar campo del modelo
    const filename = await fileUpload(req.files, undefined, collection);
    objectModel.img = filename;

    await objectModel.save();

    return res.json({
        result: true,
        objectModel
    });
}


/**
 * Obtiene la imagen de un registro en una colección solicitada
 * Se valida que el registro con el id recibido de la colección recibida exista
 * Devuelve la imagen del registro solicitado
 */
const getFile = async(req, res = response) => {

    const {id, collection} = req.params;
    let objectModel;

    switch (collection) {
        case 'users':
            objectModel = await User.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    result: false,
                    msg: 'No existe usuario con ese id'
                });
            }
            break;
        case 'products':
            objectModel = await Product.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    result: false,
                    msg: 'No existe producto con ese id'
                });
            }
            break;
        default:
            res.status(500).json({ result: true, msg: 'No implementado' });
    }

    //Buscamos imagen del objeto o establecemos una default
    const filepath = ((objectModel.img))? path.join(__dirname, '../uploads', collection, objectModel.img) : path.join(__dirname, '../assets', 'no-image.jpg');

    //Regresamos el archivo solicitado
    if (fs.existsSync(filepath)) {
        return res.sendFile(filepath);
    } else {
        //Puede ser que la imagen default se quiera controlar desde el front
        //o se puede mandar una imagen default desde aqui
        return res.sendFile(path.join(__dirname, '../assets', 'no-image.jpg'));
    }
}

//Exportamos las funciones para que esten disponibles en los archivos de rutas
module.exports = {
    loadFile,
    fileUpdate,
    getFile
}