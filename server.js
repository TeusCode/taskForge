require('dotenv').config();

const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const app = express();
//Rotas:
const port = 5000;
const routes = require('./routes.js');
//Realizando conexão com banco de dados:
//IMPORTANTE: o BD, deve se conectar antes do inicio do Servidor, para que o conteúdo esteja pronto para ser carregado na página
mongoose.connect(process.env.CHAVE,)
.then(()=>{
    app.emit('pronto');//Sinaliza para o ligar o servidor!
    console.log(chalk.bgGreen('Conexão realizada com sucesso, ao banco de dados!'));
})
.catch(e=>console.log(e));

//Configura o viewEngine
app.set('views', './src/views');//Seta o caminho da pasta views
app.set('view engine', 'ejs');//Seta qual engine o express, deve utilizar
//Avisa o express, que precisa tratar o req.body (os posts)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());//Parsed de Json para dentro da aplicação
//Configura pasta de arquivos estáticos: css, js etc...
app.use(express.static('public'));
app.use('/frontEnd', express.static('frontEnd'));

app.use(routes);//Define para o Express que utilize as rotas do arquivo de routes.js










//Inicia Servidor
app.on('pronto',()=>{//Recebe sinal da conexão com BD
    app.listen(port,()=>{
    console.log(chalk.bgGreen('Servidor iniciado!'));
    console.log('Rodando na porta:',port);
});

})
