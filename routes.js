//Meu arquivo de rotas!
const express = require('express');
const route = express.Router();
//Middlewares:
const {checkCsrfMiddleware, errosMiddleware} = require('./src/middlewares/middlewares');

//Controllers:
const HomeControllers = require('./src/controllers/HomeControllers');
const LoginControllers = require('./src/controllers/LoginControllers');
const TaskControllers = require('./src/controllers/TaskControllers');

//Rotas Home:
route.get('/',HomeControllers.index);
//Rotas Login:
route.get('/login',LoginControllers.index);
route.post('/login/register',LoginControllers.register);

//EM CONSTRUÇÃO...
route.post('/login/logar',LoginControllers.login);


//Rotas Tarefas:
route.get('/tasks',TaskControllers.tasks);
route.post('/task/add',TaskControllers.addTask);
route.post('/task/delete/:id',TaskControllers.deleteTask);

















module.exports = route;