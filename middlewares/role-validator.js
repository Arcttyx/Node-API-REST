const { response } = require('express');

/**
 * Función que valida que el usuario realizando la petición es un Administrador
 * También valida la existencia de un token en un usuario definido
 */
const isForAdminRole = (req, res = response, next) => {

    //req.user fue definido en el middleware de jwt validator
    //por eso se puede ocupar aqui
    if ( !req.user ) {
        return res.status(500).json({
            result: false,
            msg: 'Se quiere verificar el rol sin validar el token'
        });
    }

    const { catalog_role_id, name } = req.user;
    if (catalog_role_id != 'ADMINISTRADOR') {
        return res.status(401).json({
            result: false,
            msg: `${name} no es un administrador y no tiene permiso para hacer esto`
        });
    }

    //Indicamos que se puede pasar al siguiente middleware o controlador
    next();
}


/**
 * Función que valida que el rol del usuario que realiza la petición esta entre los permitidos
 * Valida la existencia de un token en un usuario definido
 * @param  {...any} roles Roles permitidos
 * @returns 
 */
const isAnyOfTheseRoles = ( ...roles ) => {
    return (req, res = response, next) => {

        //req.user fue definido en el middleware de jwt validator
        //por eso se puede ocupar aqui
        if ( !req.user ) {
            return res.status(500).json({
                result: false,
                msg: 'Se quiere verificar el rol sin validar el token'
            });
        }

        if ( !roles.includes(req.user.catalog_role_id) ) {
            return res.status(401).json({
                result: false,
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        //Indicamos que se puede pasar al siguiente middleware o controlador
        next();
    }
}

module.exports = {
    isForAdminRole,
    isAnyOfTheseRoles
}