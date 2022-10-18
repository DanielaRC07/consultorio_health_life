const { render } = require('ejs');
const { application } = require('express');
//const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
const urlcodeParser = bodyParser.urlencoded({ extended: false })
const express = require('express');
const connection = require('../database/db');
const router = express.Router();


// variables de session
const session = require('express-session');
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/registro', (req, res) => {
    res.render('registro');
});
router.get('/cita', (req, res) => {
    res.render('cita');
});

//Registro POST
router.post('/registro', (req, res, next) => {
    //capturamos los tres campos
    const name = req.body.name;
    const num_ident = req.body.num_ident;
    const email = req.body.email;
    //encriptamos la contraseña
    //let passwordencry = await bcryptjs.hash(pass,8); por si algo jaja y necesitamos
    connection.query("INSERT INTO pacientes SET ?", { id: num_ident, nombre: name, email: email }, async (error, results) => {
        if (error) {
            console.log(error);
            res.render('registro', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Incorrecto",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            res.render('registro', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "Registro Exitoso",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        };
    });
});
router.post('/auth', (req, res) => {
    const email = req.body.email;
    const identificacion = req.body.password;
    if (email && identificacion) {
        connection.query('SELECT * FROM pacientes WHERE email = ?', [email], async (error, result) => {
            if (result.length == 0 || identificacion != result[0].id) {
                console.log("Esta es la de la base de datos" + result[0].id + "Esta es la de ingreso" + identificacion);
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Email y/o Identificacion Incorrectas",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                });
            } else {
                req.session.loggedin = true;
                req.session.Identificacion = result[0].Identificacion;
                console.log(result[0].name)
                res.render('login',{
                    alert: true,
                    alertTitle: "Conexión Exitosa",
                    alertMessage: "Login Correcto",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                })
            }
            res.end();
        })
    } else {
        res.send('Ingrese un su email y identificacion');
    }
});
//Método para controlar que está auth en todas las páginas
router.get('/session', (req, res) => {
    if (req.session.loggedin) {
        res.render('session', {
            login: true,
            email: req.session.Identificacion
        });
    } else {
        res.render('session', {
            login: false,
            name: 'De click para Iniciar Sesion!',
        });
    }
    res.end();
});
router.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    })
});

//registro cita
router.post('/cita', (req, res, next) => {
    //capturamos los tres campos
    const fecha = req.body.fecha;
    const hora = req.body.hora;
    //encriptamos la contraseña
    //let passwordencry = await bcryptjs.hash(pass,8); por si algo jaja y necesitamos
    connection.query("INSERT INTO citas SET ?", { fecha: fecha, hora: hora }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('registro', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "Registro Exitoso",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                rute: ''
            });
        }
    });
});
//mostrar registros
router.post('/mostrar', urlcodeParser, function (req, res) {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        const x = ""
        const consulta = "select * from pacientes"
        conn.query(consulta, [req.body], (err, result, rows) => {
            if (err) {
                { res.send(err) }
            } else {
                res.status(200).send({ result })
                console.log(result)
            }
        })
    })
});
//verificar usuario
router.post('/show', urlcodeParser, function (req, res) {
    const Identificacion = req.body.Identificacion;
    const email = req.body.email;
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        const x = ""
        const consulta = x.concat('select * from pacientes where Identificacion="', Identificacion, '"and email="', email, '"')
        console.log(consulta)
        conn.query(consulta, [req.body], (err, result, rows) => {
            if (err) {
                { res.send(err) }
            } else {
                if (result.length > 0) {
                    res.status(200).send({ existe: 1, Identificacion: result[0].Identificacion })
                    console.log(result[0].Identificacion)
                } else {
                    res.status(200).send({ existe: 0 })
                }
            }
        })
    })
});
module.exports = router;