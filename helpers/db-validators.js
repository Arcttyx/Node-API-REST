const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

/**
 * Archivo para definición de validaciones de campos contra la BD
 * 
 */

////////////////////////////////////////////////////////////////////////
///////////////////////////////////USER/////////////////////////////////
////////////////////////////////////////////////////////////////////////

const isValidRole = async(role_name = '') => {
    //Validar el rol que viene contra los registrados en la BD
    const roleExists = await Role.findOne({ role: role_name });
    if ( !roleExists ) {
        throw new Error(`El valor ${role_name} no es un rol válido registrado`);
    }
};

const isEmailAlreadyTaken = async(email = '') => {
    //Validar que no se puedan registrar dos usuarios con el mismo correo
    emailExist = await User.findOne({ email: email });
    if (emailExist) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

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
const productExistsById = async( id ) => {
    //Verificar si el usuario existe en la BD por id
    const productExist = await Product.findById( id );
    if (!productExist) {
        throw new Error(`El producto con el id ${id} no existe`);
    }
}

module.exports = {
    isValidRole,
    isEmailAlreadyTaken,
    userExistsById,

    categoryExistsById,

    productExistsById
}