const taskModel = require('../models/taskModel');
exports.index = (req,res)=> res.render('task');

exports.addTask = async (req,res) => {
    if(!req.body) return;

const objTask = {
    taskName: req.body.taskName,
};

await taskModel.addBanco(objTask);
res.send('DADOS ENVIADOS!');
}