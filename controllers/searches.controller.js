const {response}  = require('express');
const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');

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
        resuts: users
    });
}

const searchCategories = async(term = '', res = response) => {
    const regex = new RegExp(term, 'i');

    const categories = await Category.find({
        name: regex,
        //status: true
    });

    return res.json({
        resuts: categories
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
        resuts: products
    });
}

const searchProductsByCategory = async(cat = '', res = response) => {
    const regex = new RegExp(cat, 'i');
    const category = await Category.findOne({name: regex})

    if (!category) {
        return res.json({ resuts: [] });
    }

    const products = await Product.find({
        catalog_product_category_id: category._id,
        //status: 'DISPONIBLE'
    })
    .populate('catalog_product_category_id', 'name');

    return res.json({
        resuts: products
    });
}

const search = ( req, res = response ) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
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
            res.status(500).json({
                msg: 'Búsqueda no implementada'
            });
    }
}

module.exports = {
    search
}