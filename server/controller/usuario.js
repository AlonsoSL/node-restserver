const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const { verificaToken, verificaRol_Admin } = require('../middlewares/autenticacion')

app.get('/usuario', verificaToken, (req, res) => {

    //variables para el paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email rol estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });

            })
        })

});

app.post('/usuario', [verificaRol_Admin, verificaToken], (req, res) => {

    let body = req.body;

    //creo una instancia de mi modelo 
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    //grabamos el usuario en la base de datos
    usuario.save((err, usuariDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuariDB.password = null;
        res.json({
            ok: true,
            usuario: usuariDB
        });
    });


});

app.put('/usuario/:id', [verificaToken, verificaRol_Admin], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);


    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuariDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuariDB
        })
    })

});

app.delete('/usuario/:id', [verificaToken, verificaRol_Admin], (req, res) => {

    let id = req.params.id;

    let borradoLogico = {
        estado: false
    };

    //Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
    Usuario.findByIdAndUpdate(id, borradoLogico, {
        new: true
    }, (err, usuarioEliminado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioEliminado
        });

    });

});

module.exports = app;