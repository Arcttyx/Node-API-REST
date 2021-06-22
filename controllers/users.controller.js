const { response, request } = require('express');


const usersGet = (req = request, res = response) => {

    //Obtenemos de forma destructurada los query params de la URL q=
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page, 
        limit
    });
}

const usersPost = (req, res = response) => {

    //Obtenemos de forma destructurada los argumentos que venagn del POST
    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - usersPost',
        nombre, 
        edad
    });
}

const usersPut = (req, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    res.json({
        msg: 'put API - usersPut',
        id
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usersPatch'
    });
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usersDelete'
    });
}




module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
}