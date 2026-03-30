// Importa o Express para criar o roteador
const express = require("express");

// Cria um roteador — é como um "mini app" que agrupa rotas relacionadas
// Em vez de definir tudo no app.js, separamos as rotas em arquivos organizados
const router = express.Router();

// Importa o módulo 'path' do Node.js para montar caminhos de arquivos
// de forma segura e compatível com qualquer sistema operacional (Windows/Linux/Mac)
const path = require("path");

// Importa o controller responsável pelo login e cadastro de usuários
// O controller contém a lógica de negócio, mantendo as rotas limpas e organizadas
const LoginController = require("./../controller/LoginUsuarioController");

// Importa o controller responsável pelos lançamentos financeiros
const RegistroController = require("../controller/RegistroController");

// -----------------------------------------------------------------------
// ROTAS GET — usadas para o navegador BUSCAR/CARREGAR uma página
// -----------------------------------------------------------------------

// Rota GET /Acesso — serve a página de login/cadastro ao usuário
// Quando o navegador acessa "/Acesso", o servidor envia o arquivo HTML de acesso
router.get("/Acesso", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/Acesso.html"));
});

// Rota GET /dashboard — serve a página principal do sistema após o login
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../view/dashboard.html"));
});

// Rota GET /controle — serve a página de controle de lançamentos
router.get("/controle", (req, res) => {
    res.sendFile(path.join(__dirname, "../view/controle.html"));
});

// -----------------------------------------------------------------------
// ROTAS POST — usadas para o navegador ENVIAR dados ao servidor
// -----------------------------------------------------------------------

// Rota POST /login — recebe os dados do formulário de login (email e senha)
// e delega a lógica para o método 'logar' do LoginController
router.post("/login", (req, res) => {
  LoginController.logar(req, res);
});

// Rota POST /cadastrar — recebe os dados do formulário de cadastro
// e delega para o método 'cadastrar' do LoginController
router.post("/cadastrar", (req, res) => {
  LoginController.cadastrar(req, res);
});

// Rota POST /controle/novolancamento — recebe os dados de um novo lançamento financeiro
// Aqui passamos o método do controller DIRETAMENTE como callback (forma mais curta)
// É equivalente a: (req, res) => { RegistroController.criar(req, res) }
router.post("/controle/novolancamento", RegistroController.criar);

// Exporta o roteador para ser registrado no app.js com app.use(rotas)
module.exports = router;