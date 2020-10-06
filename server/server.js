require('./config/config');
const express = require('express')
const app = express()
const mongoose = require('mongoose');

const path = require('path');
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//configuracion global de rutas
app.use(require('./controller/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;

        console.log('base de datos en linea');
    });
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});