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
      res.status(200).json({
        message: 'Tarefa atualizada!',
        task: task
    });
} catch (error) {
    res.status(400).json({
        message: 'Não foi possível atualizar a tarefa.'
    });
}
}

exports.deleteTask = async (req,res)=>{
    try {
        await taskModel.deleteTask(req.params.id);
        res.status(200).json({
        message: 'Tarefa deletada!',
    });
        return;
    } catch (error) {
        res.status(400).json({
        message: 'Não foi possível deletar a tarefa.'
    });
    }
};

exports.statusTask = async (req,res)=>{
    const idTask = req.body.idTask;
    const newStatus = req.body.status;
    try{
        const task = await taskModel.updateStatus(idTask,newStatus);
        res.status(200).json(newStatus);
        return;
    }catch(e){
        console.log(e);
        res.status(500).json({
        message: 'Erro ao atualizar o status da tarefa!'});
        return;
    }
};