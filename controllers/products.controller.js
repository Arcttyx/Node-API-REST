const { response } = require('express');
const Product = require('../models/product');

/**
 * Procesamiento para obtener los egistros del modelo Product de forma paginada
 */
 const getProducts = async(req = request, res = response) => {

    const { limit = 5, skip = 0 } = req.query;
    const whereConditions = { status: ['DISPONIBLE', 'AGOTADO', 'DESHABILITADO'] }

    //Arreglo de promesas con desestructuracion posicional
    //Primero se hace la llamada para saber el total y luego para traer los registros
    //en el mismo await, en vez de hacer dos (lo que lo haría más lento por separado)
    const [ totalProducts, products ] = await Promise.all([
        Product.countDocuments(whereConditions),

        Product.find(whereConditions)
        .limit(Number(limit))
        .skip(Number(skip))
        .populate('category', 'name')   //join y solo mostrar el nombre de la categoría
    ]);

    res.json({
        result: true,
        totalProducts,
        products
    });
}

/**
 * Procesamiento para obtener un registro por id del modelo Product
 */
 const getProduct = async(req = request, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    const product = await Product.findById(id).populate('category', 'name');

    res.json({
        result: true,
        product
    });
}

const createProduct = async(req, res = response) => {
    //Obtenemos de forma destructurada los argumentos que vengan del POST
    const {created_at, updated_at, ...productData} = req.body;

    const nameProduct = productData.name.toUpperCase();
    const productInBD = await Product.findOne({ name: nameProduct });

    if (productInBD) {
        return res.status(400).json({
            msg: `El producto ${nameProduct} ya existe`
        });
    }

    //Preparar datos a guardar
    productData.name = nameProduct;
    const product = new Product(productData);

    //Guardar en BD
    await product.save();

    res.status(201).json(product);
}

/**
 * Procesamiento de las peticiones PUT referentes al modelo User
 * Asume que ya se validaron los campos obligatorios desde user.routes
 * así como que el id recibidoen los parámetros de la ruta sea un id de mongo válido
 */
 const updateProduct = async(req, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Obtenemos de forma destructurada los argumentos que vengan del PUT
    //Quitamos el _id de mongo (si es que viniera), prque en teoría lo estamos obteniendo del parámetro de la ruta
    const { _id, created_at, updated_at, ...productData } = req.body;

    if (productData.name) {
        const nameProduct = productData.name.toUpperCase();
        const productInBD = await Product.findOne({ name: nameProduct });

        if (productInBD) {
            return res.status(400).json({
                msg: `El producto ${nameProduct} ya existe`
            });
        }

        productData.name = nameProduct;
    }

    //Actualizar la información del usuario
    productData.updated_at = Date.now();
    const product = await Product.findByIdAndUpdate(id, productData, {new: true} );

    res.json({
        result: true,
        product
    });
}

const deleteProduct = async(req, res = response) => {
    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Borrado físico
    //const user = await User.findByIdAndDelete(id);

    //Borrado lógico
    const product = await Product.findByIdAndUpdate(id, {status: 'ELIMINADO'}, {new:true});

    res.json({
        result: true,
        product
    });
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}