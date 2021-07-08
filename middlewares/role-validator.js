const { response } = require('express');

const isForAdminRole = (req, res = response, next) => {
    
    //req.user fue definido en el middleware de jwt validator
    //por eso se puede ocupar aqui
    if ( !req.user ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token'
        });
    }

    const { catalog_role_id, name } = req.user;
    if (catalog_role_id != 'ADMINISTRADOR') {
        return res.status(401).json({
            msg: `${name} no es un administrador y no tiene permiso para hacer esto`
        });
    }
    
    next();
}

const isAnyOfTheseRoles = ( ...roles ) => {
    return (req, res = response, next) => {

        if ( !req.user ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token'
            });
        }

        if ( !roles.includes(req.user.catalog_role_id) ) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isForAdminRole,
    isAnyOfTheseRoles
}