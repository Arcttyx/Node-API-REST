//Importaciones de dependencias de terceros
const {response}  = require('express');

//Importaciones de modelos
const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');


//Colecciones permitidas sobre las cuales se puede hacer la búsqueda
const allowedCollections = [
    'users',
    'products',
    'products-by-category',
    'categories'
];

const searchUsers = async(term = '', res = response) => {
    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{name: regex}, {email:regex}],
        //$and: [{status:'ACTIVO'}]
    });

    return res.json({
        result: true,
        results: users
    });
}

const searchCategories = async(term = '', res = response) => {
    const regex = new RegExp(term, 'i');

    const categories = await Category.find({
        name: regex,
        //status: true
    });

    return res.json({
        result: true,
        results: categories
    });
}

const searchProducts = async(term = '', res = response) => {
    const regex = new RegExp(term, 'i');

    const products = await Product.find({
        name: regex,
        //status: 'DISPONIBLE'
    })
    .populate('catalog_product_category_id', 'name');

    return res.json({
        result: true,
        results: products
    });
}

const searchProductsByCategory = async(cat = '', res = response) => {
    const regex = new RegExp(cat, 'i');
    const category = await Category.findOne({name: regex})

    if (!category) {
        return res.json({ result: false, msg: "La categoría no existe", resuts: [] });
    }

    const products = await Product.find({
        catalog_product_category_id: category._id,
        //status: 'DISPONIBLE'
    })
    .populate('catalog_product_category_id', 'name');       //Incluye en la respuesta por producto, el nombre de su categoría

    return res.json({
        result: true,
        results: products
    });
}

/**
 * Función para buscar registros de una colección
 * Se valida que la colección buscada esté implementada
 * Busca los registros en su colección sin contemplar diferencia entre mayusculas o minusculas
 */
const search = ( req, res = response ) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            result: false,
            msg: `No es posible buscar en la colección ${collection}`
        });
    }

    switch (collection) {
        case 'users':
            //Validar rol que busca
            searchUsers(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'products-by-category':
            searchProductsByCategory(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        default:
            return res.status(500).json({
                result: false,
                msg: 'Búsqueda por esta colección no implementada'
            });
    }
}

//Se exporta la función de búsqueda para su disponibilidad en los archivos de rutas
module.exports = {
    search
}