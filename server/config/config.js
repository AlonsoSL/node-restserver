/**
 * puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';




//==========================
// Venciminto token
//60 segudos
//60 minutos
//24 horas 
//30 dias
//==========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==========================
// Base de Datos
//==========================
process.env.SEMILLA = process.env.SEMILLA || 'este-el-secret-en-desarrollo';




//==========================
// Base de Datos
//==========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;