const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: { type: String},
    userId: {type:String, required:true},
    date: { type: Date, default: Date.now },
    status: {type:String}
});
const taskModel = mongoose.model('Task',taskSchema);

exports.addBanco = async (dados)=>{
    return await taskModel.create(dados);//Adiciona os dados no BD
}

exports.buscaTasks = async (id)=>{
    const tasks = await taskModel.find({userId:id});
    return tasks;
}

exports.deleteTask = async (id)=>{
    const taksDeletada = await taskModel.findByIdAndDelete(id,{new:true});
    return;
}

exports.updateStatus = async (id, status) =>{
   const newTask =  await taskModel.findByIdAndUpdate(id,{status:status},{new:true});
    console.log('STATUS ATUALIZADO NO BANCO!');
    console.log('ID E STATUS',id, status);
    console.log('TAREFA:',newTask,'TIPO:',typeof newTask);

    return newTask;
}