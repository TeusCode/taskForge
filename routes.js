//Meu arquivo de rotas!
const express = require('express');
const route = express.Router();

//Middlewares
const checkAuth = require('./src/middlewares/middlewares').checkAuth;
const loadTasks = require('./src/middlewares/middlewares').loadTasks;

//Controllers:
const HomeControllers = require('./src/controllers/HomeControllers');
const LoginControllers = require('./src/controllers/LoginControllers');
const TaskControllers = require('./src/controllers/TaskControllers');

//Rotas Home:
route.get('/',HomeControllers.index);
//Rotas Login:
route.get('/login',LoginControllers.index);
route.post('/login/register',LoginControllers.register);
route.post('/login/logar',LoginControllers.login);
route.get('/login/logout',LoginControllers.logout);


//Rotas Tarefas:
route.get('/tasks',checkAuth,loadTasks,TaskControllers.tasks);
route.post('/task/add',checkAuth,TaskControllers.addTask);
route.post('/task/delete/:id',checkAuth,TaskControllers.deleteTask);
route.post('/task/status',checkAuth,TaskControllers.statusTask);
















module.exports = route;