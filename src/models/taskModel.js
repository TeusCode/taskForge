const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: { type: String,},
    date: { type: Date, default: Date.now },
    status: {type:String, default:'pendente'}
});
const taskModel = mongoose.model('Task',taskSchema);

exports.addBanco = async (dados)=>{
    await taskModel.create(dados);//Adiciona os dados no BD
    console.log('Dados adicionados ao banco!');
}

exports.buscaTasks = async ()=>{
    const tasks = await taskModel.find().sort({criadoEm: 1});
    return tasks;
}