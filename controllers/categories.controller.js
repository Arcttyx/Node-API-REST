const { response } = require('express');
const Category = require('../models/category');

/**
 * Procesamiento para obtener los egistros del modelo Category de forma paginada
 */
 const getCategories = async(req = request, res = response) => {

    const { limit = 5, skip = 0 } = req.query;
    const whereConditions = { status: true }

    //Arreglo de promesas con desestructuracion posicional
    //Primero se hace la llamada para saber el total y luego para traer los registros
    //en el mismo await, en vez de hacer dos (lo que lo haría más lento por separado)
    const [ totalCategories, categories ] = await Promise.all([
        Category.countDocuments(whereConditions),

        Category.find(whereConditions)
        .limit(Number(limit))
        .skip(Number(skip))
        .populate('user', 'name')   //join y solo mostrar el nombre del usuario
    ]);

    res.json({
        result: true,
        totalCategories,
        categories
    });
}

/**
 * Procesamiento para obtener un registro por id del modelo Category
 */
 const getCategory = async(req = request, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json({
        result: true,
        category
    });
}

const createCategory = async(req, res = response) => {
    const nameCategory = req.body.name.toUpperCase();
    const categoryInBD = await Category.findOne({ name: nameCategory });

    if (categoryInBD) {
        return res.status(400).json({
            msg: `La categoría ${nameCategory} ya existe`
        });
    }

    //Preparar datos a guardar
    //No queremos que puedan enviarnos status ni id de usuario en la petición
    //El id los obtendremos del usuario autenticado y status por default es true
    const category = new Category({ name: nameCategory, user: req.user._id });

    //Guardar en BD
    await category.save();

    res.status(201).json(category);
}

/**
 * Procesamiento de las peticiones PUT referentes al modelo User
 * Asume que ya se validaron los campos obligatorios desde user.routes
 * así como que el id recibidoen los parámetros de la ruta sea un id de mongo válido
 * @param {*} req 
 * @param {*} res 
 */
 const updateCategory = async(req, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Obtenemos de forma destructurada los argumentos que vengan del PUT
    //Solo permitiremos la actualización del nombre
    const nameCategory = req.body.name.toUpperCase();
    const userCategory = req.user._id;

    //Revisar que no exista el nombre nuevo ya registrado
    const categoryInBD = await Category.findOne({ name: nameCategory });
    if (categoryInBD) {
        return res.status(400).json({
            msg: `La categoría ${nameCategory} ya existe`
        });
    }

    //Actualizar la información de la categoría
    const category = await Category.findByIdAndUpdate(id, {name: nameCategory, user: userCategory}, {new: true});

    res.json({
        result: true,
        category
    });
}

const deleteCategory = async(req, res = response) => {
    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Borrado físico
    //const user = await User.findByIdAndDelete(id);

    //Borrado lógico
    const category = await Category.findByIdAndUpdate(id, {status: false});

    res.json({
        result: true,
        category
    });
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}