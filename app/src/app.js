//faço a atribuição do módulo do express para servir os arquivos estáticos e lidar com as rotas, além de configurar os middlewares necessários
const express = require('express');
//faço a atribuição do módulo path para lidar com os caminhos dos arquivos
const path = require('path');
//faço a atribuição na variável app do express para configurar os middlewares e as rotas
const app = express();
//faço a atribuição do módulo cors para lidar com as requisições de diferentes origens, permitindo que o frontend e o backend se comuniquem sem problemas de CORS
const cors = require("cors");
//faço a atribuição do módulo de sessão para lidar com as sessões dos usuários, permitindo que eles permaneçam logados enquanto navegam pelo sistema, e garantindo que as informações de login sejam mantidas durante a navegação
const session = require('express-session');
//carrego as variáveis de ambiente do arquivo .env, mantendo informações sensíveis como a chave secreta fora do código
require('dotenv').config();
//faço a atribuição do módulo de rotas para lidar com as rotas definidas no arquivo rotas.js, que é onde estão as rotas para login, cadastro e outras funcionalidades do sistema
const rotas = require('./router/rotas.js');

// Habilita o CORS (Cross-Origin Resource Sharing), permitindo que o servidor aceite
// requisições de origens diferentes (outros domínios, portas ou protocolos)
app.use(cors());

// Permite que o Express interprete requisições com corpo em formato JSON (Content-Type: application/json)
app.use(express.json());

// Permite que o Express interprete dados enviados por formulários HTML (Content-Type: application/x-www-form-urlencoded)
// O parâmetro { extended: true } permite objetos e arrays aninhados no corpo da requisição
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos (HTML, CSS, JS, imagens, etc.) da pasta 'public' no diretório raiz do projeto
app.use(express.static(path.join(__dirname, '/public')));

// Configura o middleware de sessão para manter o estado do usuário entre requisições
app.use(session({
  secret: process.env.SESSION_SECRET, // Chave secreta usada para assinar e validar o cookie de sessão (definida no .env)
  resave: false,                       // Não salva a sessão novamente se ela não foi modificada durante a requisição
  saveUninitialized: true,             // Salva sessões novas mesmo que ainda não tenham dados armazenados
  cookie: { secure: false }            // Se 'true', o cookie só é enviado em conexões HTTPS; 'false' permite HTTP (apenas para desenvolvimento)
}));

// Registra todas as rotas da aplicação definidas no módulo 'rotas'
app.use(rotas);

// Exporta o app configurado para ser utilizado em outros arquivos (ex: server.js para iniciar o servidor)
module.exports = app;