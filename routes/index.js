const { application } = require('express');
//const bcryptjs = require('bcryptjs');
const express = require('express');
const connection = require('../database/db');
const router = express.Router();


router.get('/',(req,res) =>{
    res.render('index');
});

router.get('/login',(req,res) =>{
    res.render('login');
});

router.get('/registro',(req,res) =>{
    res.render('registro');
});

//Registro POST
router.post('/registro', async(req,res,next) => {
    //capturamos los tres campos
    const name = req.body.name;
    const num_ident = req.body.num_ident;
    const email = req.body.email;
    //encriptamos la contraseña
    //let passwordencry = await bcryptjs.hash(pass,8); por si algo jaja y necesitamos
    connection.query("INSERT INTO pacientes SET ?", {Identificacion:num_ident,nombre:name,email:email}, async(error, results) =>{
        if(error){
            console.log(error);
        }else{
            res.render('registro',{
                alert:true,
                alertTitle: "Registro",
                alertMessage: "Registro Exitoso",
                alertIcon:'success',
                showConfirmButton:false,
                timer:1500,
                rute:''
            });
        }
    });
});
module.exports = router;