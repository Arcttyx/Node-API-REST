const { response } = require('express');
const Category = require('../models/category');

/**
 * Procesamiento para obtener los registros ACTIVOS del modelo Category de forma paginada
 * Por default regresará los primeros 5 registros
 * Devuelve también el total de registros
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
        ////.populate('user', 'name')   //join y solo mostrar el nombre del usuario
    ]);

    return res.json({
        result: true,
        totalCategories,                //lo mismo que totalCategories: totalCategories
        categories                      //lo mismo que categories: categories
    });
}

/**
 * Procesamiento para obtener un registro por id del modelo Category
 * Asume que ya se buscó que el registro con ese id exista en la BD en category.routes
 * Devuelve la categoría encontrada
 */
 const getCategory = async(req = request, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre, en este caso el id
    const { id } = req.params;

    const category = await Category.findById(id)
        ////.populate('user', 'name');

    return res.json({
        result: true,
        category
    });
}

/**
 * Procesamiento de las peticiones POST referentes al modelo Category
 * Asume que ya se validaron los campos obligatorios desde category.routes
 * Pasa a mayúscula el nombre de la categoría
 * Crea el registro de la categoría en la BD
 * Devuelve la categoría creada
 */
const createCategory = async(req, res = response) => {
    const nameCategory = req.body.name.toUpperCase();
    const categoryInBD = await Category.findOne({ name: nameCategory });

    if (categoryInBD) {
        return res.status(400).json({
            result: false,
            msg: `La categoría ${nameCategory} ya existe`
        });
    }

    //Preparar datos a guardar
    //No queremos que puedan enviarnos status ni id de usuario en la petición
    //El id los obtendremos del usuario autenticado y status por default es true
    const category = new Category({ 
        name: nameCategory,
        ////user: req.user._id 
    });

    //Guardar en BD
    await category.save();

    return res.status(201).json({
        result: true,
        category
    });
}

/**
 * Procesamiento de las peticiones PUT referentes al modelo Category
 * Asume que ya se validaron los campos obligatorios desde category.routes
 * así como que el id recibido en los parámetros de la ruta sea un id de mongo válido
 * aquí se valida que el valor recibido no exista previniendo valores duplicados
 * y se regresa la categoría actualizada en caso de todo tener éxito
 */
 const updateCategory = async(req, res = response) => {

    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Obtenemos de forma destructurada los argumentos que vengan del PUT
    //Solo permitiremos la actualización del nombre
    const nameCategory = req.body.name.toUpperCase();
    ////const userCategory = req.user._id;

    //Revisar que no exista el nombre nuevo ya registrado
    const categoryInBD = await Category.findOne({ name: nameCategory });
    if (categoryInBD) {
        return res.status(400).json({
            result: false,
            msg: `La categoría ${nameCategory} ya existe`
        });
    }

    //Actualizar la información de la categoría
    const category = await Category.findByIdAndUpdate(id,
        {
            name: nameCategory,
            ////user: userCategory
        },
        {new: true}                     //Para que devuelva el registro actualizado y no el pasado antes de guardar
    );

    return res.json({
        result: true,
        category
    });
}

/**
 * Procesamiento de las peticiones DELETE referentes al modelo Category
 * asume que el id recibido en los parámetros de la ruta sea un id de mongo válido
 * que el registro con ese id exista en la BD
 * y se hace el borrado lógico del registro en la BD en caso de tener éxito
 */
const deleteCategory = async(req, res = response) => {
    //Obtenemos de forma destructurada los parámetros de la URL/10/nombre
    const { id } = req.params;

    //Borrado físico
    //const user = await User.findByIdAndDelete(id);

    //Borrado lógico
    const category = await Category.findByIdAndUpdate(id, {status: false});

    return res.json({
        result: true,
        category
    });
}

//Se exportan las funciones para que esten disponibles en los archivos de rutas
module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}