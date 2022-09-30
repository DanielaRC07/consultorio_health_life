//importamos express para utlizarlo
const express = require('express');
const app = express();
//Hacemos set para la captura de datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// invocamops a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});
// el directorio publico
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
//utilizamos el motor de platillas
app.set('view engine', 'ejs');
//encriptar contraseñas modulo
const bcryptjs =  require('bcryptjs');
//varibles de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//invocamos la conexxion de la DB
const connection = require('./database/db');

//rutas
app.use('/', require('./routes/index'))
require('./routes/index');

app.listen(3000,(req, res) => {
    console.log('servidor en ejecucion');
})