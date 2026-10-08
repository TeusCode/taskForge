const taskMoldel = require('../models/taskModel');

exports.errosMiddleware = (req,res,next)=>{
    res.locals.erros = req.flash('erros');
    res.locals.sucessos = req.flash('sucessos');
    res.locals.user = req.session.user;
    next();
}

exports.middlewareGlobal = async (req,res,next)=>{
    const tasks = await taskMoldel.buscaTasks();
    res.locals.tasks = tasks;
    next();
}

//Middleware - Cria token para todas os formulários!
exports.csrfMiddleware = (req,res,next)=>{
    res.locals.csrfToken = req.csrfToken(); //Cria o token para todas requisições form post, será enviado para o view e será adicionado ao input oculto
    next();
}

exports.checkCsrfMiddleware = (error,req,res,next)=>{
    if(error){
        res.send('Deu erro',error);
        return;
        }
}