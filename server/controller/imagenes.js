const express = require('express');
const fs = require('fs'); //importar file system
const path = require('path'); // importar path

const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();



app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {

        let noImagePath = path.resolve(__dirname, '../assets/not-found.jpg');
        res.sendFile(noImagePath)
    }



});



module.exports = app;