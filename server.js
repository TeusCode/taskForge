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
mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    app.emit('pronto');//Sinaliza para o ligar o servidor!
    console.log(chalk.bgGreen('Conexão realizada com sucesso, ao banco de dados!'));
})

.catch(e=>console.log(e));

//Session:
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const sessionOptions = {
    secret: process.env.SECRET, //Chave usada para assinar o identificador da sessão
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    resave: false,//Deve salvar novamente a sessão se não tiver sido modificada?
    saveUninitialized: false,//Deseja salvar a sessão mesmo estando vazia?
    cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,//Tempo de vida do cookie
    httpOnly: true,
  }
}

//Configura o viewEngine
app.set('views', './src/views');//Seta o caminho da pasta views
app.set('view engine', 'ejs');//Seta qual engine o express, deve utilizar
//Avisa o express, que precisa tratar o req.body (os posts)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());//Parsed de Json para dentro da aplicação
//Configura pasta de arquivos estáticos: css, js etc...
app.use(express.static('public'));
app.use('/frontEnd', express.static('frontEnd'));

const middlewareGlobal = require('./src/middlewares/middlewareglobal');
//Middleware Glocal
app.use(middlewareGlobal);

app.use(routes);//Define para o Express que utilize as rotas do arquivo de routes.js









//Inicia Servidor
app.on('pronto',()=>{//Recebe sinal da conexão com BD
    app.listen(port,()=>{
    console.log(chalk.bgGreen('Servidor iniciado!'));
    console.log('Rodando na porta:',port);
});

})
