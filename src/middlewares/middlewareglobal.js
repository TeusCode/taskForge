const taskMoldel = require('../models/taskModel');

module.exports = async (req,res,next)=>{
    console.log('ESTOU EXECUTANDO!');
    const tasks = await taskMoldel.buscaTasks();
    res.locals.tasks = tasks;
    next();
}