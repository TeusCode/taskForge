const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: { type: String},
    userId: {type:String, required:true},
    date: { type: Date, default: Date.now },
    status: {type:String, default:'pendente'}
});
const taskModel = mongoose.model('Task',taskSchema);

exports.addBanco = async (dados)=>{
    await taskModel.create(dados);//Adiciona os dados no BD
}

exports.buscaTasks = async (id)=>{
    const tasks = await taskModel.find({userId:id});
    return tasks;
}

exports.deleteTask = async (id)=>{
    const taksDeletada = await taskModel.findByIdAndDelete(id,{new:true});
    return;
}