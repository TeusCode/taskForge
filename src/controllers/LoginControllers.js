const validator = require('validator');

exports.index = (req,res)=> res.render('login');

exports.register = (req,res)=>{
const erros = [];

//Validações User:
if(!req.body.user) erros.push('O usuário não pode ficar em branco!');
if(req.body.user <= 3) erros.push('O usuário deve conter no minimo 4 caracteres');
if(req.body.user > 20) erros.push('O seu usuário deve conter no máximo 20 caracteres');
//Validações E-mail:
if(!validator.isEmail(req.body.email)) erros.push('Digite um e-mail válido!');

//VERIFICAR SE JA EXISTE NO BANCO...

//Validações Password:
if(req.body.password < 8) erros.push('A senha deve conter no minimo 8 caracteres');
if(req.body.password !== req.body.passwordConfirm) erros.push('A confirmação da senha deve ser igual a senha!');

if(erros.length > 0) {
   req.flash('erros',erros);
   req.session.save(()=>{
    res.redirect('/login');
   });
   return;
}

req.flash('sucessos','Cadastro efetuado com sucesso!');
req.session.save(()=>{
    res.redirect('/');
});

const user = {
    user: req.body.user.trim(),
    email: req.body.email.trim(),
    telefone: req.body.telefone.toLowerCase().trim(),
    password: req.body.password
}

    return;
}



//AINDA EM CONSTRUÇÃO...
exports.login = (req,res)=>{
    res.send(req.body);
    return;
}