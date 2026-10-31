const validator = require('validator');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

exports.indexLogin = (req, res) => res.render('login');
exports.indexRegister = (req, res) => res.render('register');

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
    const userExist = await userModel.checkUser(req.body);
    if(userExist){
        erros.push('Usuário ou E-mail já existe!');
    };

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

exports.login = async (req, res) => {
    const erros = [];
    //Verifica se o usuário já está logado:
    if(req.session.user) erros.push('Você já está logado!');

    //Validações User:
    if (!req.body.user) erros.push('O usuário não pode ficar em branco!');
    if (req.body.user.length <= 3) erros.push('O usuário deve conter no minimo 4 caracteres');
    if (req.body.user.length > 20) erros.push('O seu usuário deve conter no máximo 20 caracteres');

     //Validações Password:
    if (req.body.password.length < 8) erros.push('A senha deve conter no minimo 8 caracteres');

    //Verifica se o Usuário existe!
    const userExist = await userModel.checkUser(req.body);
    if(!userExist) erros.push('Usuário ou senha incorreta!');

    if (erros.length > 0) {
        req.flash('erros', erros);
        req.session.save(() => {
            res.redirect('/login');
        });
        return;
    }

    //Checa as senhas
    bcrypt.compare(req.body.password, userExist.password, function(err, result) {
    if(result == true){
      req.flash('sucessos', 'Login realizado com sucesso!');
      req.session.user = {
        id:userExist._id,
        user:userExist.user,
        email:userExist.email
      }
        req.session.save(() => {
            res.redirect('/');
        });
        return;
    }else{
        erros.push('Usuário ou senha incorreta!');
    }

    });

    if (erros.length > 0) {
        req.flash('erros', erros);
        req.session.save(() => {
            res.redirect('/login');
        });
        return;
    }
}

exports.logout = (req,res) =>{
    req.session.destroy();
    res.redirect('/login');
}