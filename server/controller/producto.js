const express = require('express');

let { verificaToken, verificaRol_Admin } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//==================
//obetener productos
//===================
app.get('/productos', verificaToken, (res, req) => {
    //trae todos los productos con el populate cargar el usuario y la categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Numbre(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('nombre', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //usuariDB.password = null;
            res.json({
                ok: true,
                productos
            });

        });

});



//==================
//obetener producto  por id
//===================
app.get('/productos/:id', verificaToken, (res, req) => {
    //trae todos los productos con el populate cargar el usuario y la categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('nombre', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'el producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB

            })

        });

});



//==================
//crear nuevo productos
//===================
app.post('/productos', verificaToken, (res, req) => {
    //grabar usuario
    //grabar categoria del listado

    let body = req.body;
    //creo una instancia de mi modelo 
    let producto = new Producto({
        usuario: req.usuario_id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,

    });

    //grabamos el producto en la base de datos
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //usuariDB.password = null;
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});


//==================
//actualizar  productos
//===================
app.put('/productos/:id', verificaToken, (res, req) => {
    //grabar usuario
    //grabar categoria del listado

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mesagge: 'el producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })

        });

    });

});


//==================
//elminar  productos
//===================
app.delete('/productos/:id', verificaToken, (res, req) => {
    //eliminar un producto solo cammbio del estado disponible a false

    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mesagge: 'el producto no existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.save((err, productoguardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                message: 'producto eliminado'
            });

        });


    })



});




module.exports = app;