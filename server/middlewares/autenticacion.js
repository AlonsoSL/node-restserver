const jwt = require('jsonwebtoken')

//=================
//verificar token
//=================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });


};



//=================
//verificar rol de administrador
//=================

let verificaRol_Admin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'ADMIN_ROL') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaRol_Admin
}