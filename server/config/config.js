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
process.env.CADUCIDAD_TOKEN = '48h';

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


//==========================
// Google client id
//==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '706727305149-o2h31k1fmv80slmqf71tk7bg5n4qos3m.apps.googleusercontent.com';