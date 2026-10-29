const taskModel = require('../models/taskModel');
exports.index = async (req,res)=> {
    res.render('index');
};

exports.tasks = async (req,res)=> {
    res.render('task');
};

exports.addTask = async (req,res) => {
let erros = [];
if(!req.body) return;

//Cria Modelo do Objeto
const objTask = {
    taskTitle: req.body.taskTitle.trim(),
    taskDescription: req.body.taskDescription.trim(),
    status: req.body.status,
    userId: req.session.user.id
};

//Validação:
if(objTask.taskTitle === Number){
    res.redirect('/task');
    erros.push('O titulo não pode ser um número!');
    return;
}

if(objTask.taskTitle.length >= 51){
    res.redirect('/task');
    erros.push('O titulo não pode ser um número!');
    return;
}

if(!objTask.taskTitle){
    res.redirect('/tasks');
    erros.push('Você não pode inserir uma tarefa sem titulo!');
    return;
}

if(objTask.taskDescription === Number){
    res.redirect('/task');
    erros.push('As tarefas não podem precisam ser números!');
    return;
}

if(objTask.taskDescription.length >= 301){
    res.redirect('/task');
    erros.push('O titulo não pode ser um número!');
    return;
}

if(erros.length > 0) {
    req.flash('erros', erros);
        req.session.save(() => {
        res.redirect('/tasks');
        });
    return;
};

const task = await taskModel.addBanco(objTask);
res.json(task);
}

exports.editTask = async (req,res) => {
let erros = [];
if(!req.body) return;

//Cria Modelo do Objeto
const objTask = {
    taskTitle: req.body.taskTitle.trim(),
    taskDescription: req.body.taskDescription.trim(),
    userId: req.session.user.id.trim()
};

//Validação:
if(objTask.taskTitle === Number){
    res.redirect('/task');
    erros.push('O titulo não pode ser um número!');
    return;
}

if(objTask.taskTitle.length >= 51){
    res.redirect('/task');
    erros.push('O titulo não pode ser um número!');
    return;
}

if(!objTask.taskTitle){
    res.redirect('/tasks');
    erros.push('Você não pode inserir uma tarefa sem titulo!');
    return;
}

if(objTask.taskDescription === Number){
    res.redirect('/task');
    erros.push('As tarefas não podem precisam ser números!');
    return;
}

if(objTask.taskDescription.length >= 301){
    res.redirect('/task');
    erros.push('O titulo não pode ser um número!');
    return;
}

if(erros.length > 0) {
    req.flash('erros', erros);
        req.session.save(() => {
        res.redirect('/tasks');
        });
    return;
};

try {
    const task = await taskModel.editTask(req.params.id,objTask);
    res.sendStatus(200);
} catch (error) {
    res.sendStatus(400);
    console.log(error);
}
}

exports.deleteTask = async (req,res)=>{
    try {
        await taskModel.deleteTask(req.params.id);
        res.sendStatus(200);
        return;
    } catch (error) {
        console.log(error.mesage);
    }
};

exports.statusTask = async (req,res)=>{
    const idTask = req.body.idTask;
    const newStatus = req.body.status;
    try{
        const task = await taskModel.updateStatus(idTask,newStatus);
    }catch(e){
        console.log(e)
    }
    res.redirect('/tasks');
};


