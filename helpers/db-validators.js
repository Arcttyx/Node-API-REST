const Role     = require('../models/role');
const User     = require('../models/user');
const Category = require('../models/category');
const Product  = require('../models/product');

/**
 * Archivo para definición de validaciones de campos contra la BD
 * 
 */

////////////////////////////////////////////////////////////////////////
///////////////////////////////////USER/////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Función que valida que el rol enviado es uno de los registrados en la BD
 * @param {String} role_name 
 */
const isValidRole = async(role_name = '') => {
    //Validar el rol que viene contra los registrados en la BD
    const roleExists = await Role.findOne({ role: role_name });
    if ( !roleExists ) {
        throw new Error(`El valor ${role_name} no es un rol válido registrado`);
    }
};

/**
 * Función que valida la existencia de un correo en la tabla de usuarios
 * @param {String} email 
 */
const isEmailAlreadyTaken = async(email = '') => {
    //Validar que no se puedan registrar dos usuarios con el mismo correo
    emailExist = await User.findOne({ email: email });
    if (emailExist) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

/**
 * Función que valida la existencia de un usuario por el id enviado
 * @param {*} id 
 */
const userExistsById = async( id ) => {
    //Verificar si el usuario existe en la BD por id
    const userExist = await User.findById( id );
    if (!userExist) {
        throw new Error(`El usuario con el id ${id} no existe`);
    }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////CATEGORÍA///////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Función que valida la existencia de una categiría por el id enviado
 * @param {*} id 
 */
const categoryExistsById = async( id ) => {
    //Verificar si el usuario existe en la BD por id
    const categoryExist = await Category.findById( id );
    if (!categoryExist) {
        throw new Error(`La categoría con el id ${id} no existe`);
    }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////PRODUCTOS///////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Función que valida la existencia de un producto por el id enviado
 * @param {*} id 
 */
const productExistsById = async( id ) => {
    //Verificar si el usuario existe en la BD por id
    const productExist = await Product.findById( id );
    if (!productExist) {
        throw new Error(`El producto con el id ${id} no existe`);
    }
}


////////////////////////////////////////////////////////////////////////
////////////////////////////////OTHERS///////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Función que revisa si la colección enviada esta permitida para la subida de archivos
 * @param {String} collection 
 * @param {Array[String]} collections 
 * @returns 
 */
const isCollectionAllowed = (collection = '', collections = []) => {
    const isInCollections = collections.includes(collection);
    if (!isInCollections) {
        throw new Error(`La colección ${collection} no es permitida`);
    }

    return true;
}


module.exports = {
    isValidRole,
    isEmailAlreadyTaken,
    userExistsById,

    categoryExistsById,

    productExistsById,

    isCollectionAllowed
}