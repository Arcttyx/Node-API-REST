const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { fileUpload } = require("../helpers/file-utilities");
const Product = require("../models/product");
const User = require("../models/user");


/**
 * Para subir cualquier archivo al directorio default
 */
const loadFile = async(req, res = response) => {
    try {
        const filePath = await fileUpload(req.files, undefined, '');
        res.json({ fileName: filePath });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}


/**
 * Para subir/actualizar una imagen en un objeto de un modelo
 */
const fileUpdate = async(req, res = response) => {
    const {id, collection} = req.params;
    
    let objectModel;

    switch (collection) {
        case 'users':
            objectModel = await User.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    msg: 'No existe usuario con ese id'
                });
            }
            break;
        case 'products':
            objectModel = await Product.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    msg: 'No existe producto con ese id'
                });
            }
            break;
        
        default:
            res.status(500).json({ msg: 'No implementado' });
    }

    //Limpiar imágen previa
    if (objectModel.img) {
        const filepath = path.join(__dirname, '../uploads', collection, objectModel.img);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }

    const filename = await fileUpload(req.files, undefined, collection);
    objectModel.img = filename;

    await objectModel.save();

    res.json( objectModel );
}


const getFile = async(req, res = response) => {

    const {id, collection} = req.params;
    let objectModel;

    switch (collection) {
        case 'users':
            objectModel = await User.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    msg: 'No existe usuario con ese id'
                });
            }
            break;
        case 'products':
            objectModel = await Product.findById(id);
            if (!objectModel) {
                return res.status(400).json({
                    msg: 'No existe producto con ese id'
                });
            }
            break;
        
        default:
            res.status(500).json({ msg: 'No implementado' });
    }

    //Buscamos imagen del objeto o establecemos una default
    const filepath = ((objectModel.img))? path.join(__dirname, '../uploads', collection, objectModel.img) : path.join(__dirname, '../assets', 'no-image.jpg');

    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        //Puede ser que la imagen default se quiera controlar desde el front
        //o se puede mandar una imagen default desde aqui
        res.sendFile(path.join(__dirname, '../assets', 'no-image.jpg'));
    }
}

module.exports = {
    loadFile,
    fileUpdate,
    getFile
}