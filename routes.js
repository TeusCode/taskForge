//Meu arquivo de rotas!
const express = require('express');
const route = express.Router();
const HomeControllers = require('./src/controllers/HomeControllers');
const LoginControllers = require('./src/controllers/LoginControllers');

route.get('/',HomeControllers.index);
route.get('/login',LoginControllers.index);
route.post('/login/logar',(req,res)=>{
    console.log(req.body);
    res.send(req.body)
})















module.exports = route;