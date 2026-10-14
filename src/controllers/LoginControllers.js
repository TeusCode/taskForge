const validator = require('validator');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

exports.index = (req, res) => res.render('login');

exports.register = async (req, res) => {
    const erros = [];

    //Validações User:
    if (!req.body.user) erros.push('O usuário não pode ficar em branco!');
    if (req.body.user.length <= 3) erros.push('O usuário deve conter no minimo 4 caracteres');
    if (req.body.user.length > 20) erros.push('O seu usuário deve conter no máximo 20 caracteres');
    //Validações E-mail:
    if (!validator.isEmail(req.body.email)) erros.push('Digite um e-mail válido!');

    //Validações Password:
    if (req.body.password.length < 8) erros.push('A senha deve conter no minimo 8 caracteres');
    if (req.body.password !== req.body.passwordConfirm) erros.push('A confirmação da senha deve ser igual a senha!');

    const salt = bcrypt.genSaltSync();//Gera uma string aleatória
    req.body.password = bcrypt.hashSync(req.body.password, salt);//Aplica o algoritmo bcrypt fundindo a senha original em texto puro, com o salt, e substitui por uma senha criptografada.

    //Verificar se o usuário já existe:
    if(checkUser(req.body));

    const user = {
        user: req.body.user.trim(),
        email: req.body.email.trim(),
        telefone: req.body.telefone.toLowerCase().trim(),
        password: req.body.password
    }

    if (erros.length > 0) {
        req.flash('erros', erros);
        req.session.save(() => {
            res.redirect('/login');
        });
        return;
    }

    req.flash('sucessos', 'Cadastro efetuado com sucesso!');
    await userModel.addBanco(user);
    return req.session.save(() => {
        res.redirect('/');
    });
}



//AINDA EM CONSTRUÇÃO...
exports.login = (req, res) => {
    res.send(req.body);
    return;
}

const checkUser = async (dados) => {
    const user = await userModel.checkUser(dados.user);
    if(user) return true;
    if(!user) return false;
}