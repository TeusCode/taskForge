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
    taskName: req.body.taskName.trim(),
    status: req.body.status,
    userId: req.session.user.id
};

//Validação:
if(objTask.taskName === Number){
    res.redirect('/task');
    erros.push('As tarefas não podem precisam ser números');
    return;
}
if(!objTask.taskName){
    res.redirect('/tasks');
    erros.push('Você não pode inserir uma tarefa vazia!');
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
console.log('ADICIONADO AO BANCO!');
console.log(task)
res.json(task);
}

exports.deleteTask = async (req,res)=>{
    try {
        await taskModel.deleteTask(req.params.id);
        res.redirect('/tasks');
        return;
    } catch (error) {
        console.log(error.mesage);
    }
};

exports.statusTask = async (req,res)=>{
    const idTask = req.body.idTask;
    const newStatus = req.body.status;
    const task = await taskModel.updateStatus(idTask,newStatus);

    res.redirect('/tasks');
}
