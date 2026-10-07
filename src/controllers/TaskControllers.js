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
const objTask = {taskName: req.body.taskName.trim(),};//Cria Modelo do Objeto

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
    
};

await taskModel.addBanco(objTask);
res.redirect('/tasks');
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
