const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: { type: String,required: true},
    password: { type: String,required: true},
    email: {type:String, required:true},
    telefone:{type:String}
});
const userModel = mongoose.model('User',userSchema);

exports.addBanco = async (dados)=>{
    try {
        await userModel.create(dados);//Adiciona os dados no BD
    } catch (error) {
        console.log(error);
    }
}

exports.checkUser = async (dados)=>{
    try {
        const user = await userModel.findOne({
            user:dados.user,
            email:dados.email
        });
        return user;
    } catch (error) {
        console.log('Deu erro',error);
    }
}
