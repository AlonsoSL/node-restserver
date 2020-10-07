const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const usuario = require('../models/usuario');

const producto = require('../models/producto');

const fs = require('fs'); //importar file system
const path = require('path'); // importar path


app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado un archivo para cargar'
            }

        });
    }

    //validar tipo
    let tiposValdidos = ['productos', 'usuarios'];
    if (tiposValdidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipo permitidos son: ' + tiposValdidos.join(', ')
            }
        });
    }





    let archivo = req.files.archivo;

    //extencio permitida
    let extensionesValdidas = ['png', 'jpg', 'gif', 'jpeg']
        //segmenta el ombre por punto
    let nombreArc = archivo.name.split('.');
    //optiene el ultimo valor de la cadena
    let extension = nombreArc[nombreArc.length - 1];

    if (extensionesValdidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'las esxtensiones que se permiten son: ' + extensionesValdidas.join(', '),
                ext: extension
            }
        });
    }

    //cambiar nombre al archivo
    let nombreArchivo = `${ id}-${ new Date().getMilliseconds() }.${ extension }`

    //en esta parte ya se si el archivo subio
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);

        } else {
            imagenUsuario(id, res, nombreArchivo);
        }
    });


});

function imagenUsuario(id, res, nombreArchivo) {
    usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });
}



function imagenProducto(id, res, nombreArchivo) {
    producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });

    });
}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;