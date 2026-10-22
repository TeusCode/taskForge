const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskTitle:{ type: String, maxlength:40},
    taskDescription: { type: String, maxlength:300},
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
    console.log(tasks);
    return tasks;
}

exports.deleteTask = async (id)=>{
    const taksDeletada = await taskModel.findByIdAndDelete(id,{new:true});
    return;
}

exports.updateStatus = async (id, status) =>{
    const newTask =  await taskModel.findByIdAndUpdate(id,{status:status},{returnDocument: 'after'});
    return newTask;
}