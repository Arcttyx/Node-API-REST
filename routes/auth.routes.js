const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth.controller');
const { validateRouteFields } = require('../middlewares/route-fields-validator');

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateRouteFields
], login);


module.exports = router;