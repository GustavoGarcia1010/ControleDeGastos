# 🚀 Sistema de Controle Financeiro - Dashboard (Node.js)

Este é um sistema de gerenciamento administrativo e financeiro de alta performance. Originalmente concebido em PHP, o projeto foi evoluído para **Node.js**, utilizando as melhores práticas de JavaScript moderno e a arquitetura **MVC (Model-View-Controller)** para garantir um código limpo, escalável e de fácil manutenção.

---

## 📱 Visualização do Sistema

### 🔐 Autenticação e Registro

> Interface limpa e responsiva para garantir a segurança dos dados do usuário.

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1233807998007382149/1487986861904367736/image.png?ex=69cb2341&is=69c9d1c1&hm=d4fb4ea85fc627abb55c5ee481124bec6846d223fd00ea1b339280dd6941fd95&" alt="Página de Login" width="45%">
  <img src="https://cdn.discordapp.com/attachments/1233807998007382149/1487987035741360128/image.png?ex=69cb236a&is=69c9d1ea&hm=4bc458b4f4cfc7d3027039cab7dbffcad8a7f83e0b3aa09e93ea0f0b12ae0064&" alt="Página de Cadastro" width="45%">
</p>

### 📊 Página Principal

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1233807998007382149/1487994320710664192/image.png?ex=69cb2a33&is=69c9d8b3&hm=57a550310987c14c1d4891772c2a195a0c0538987d101cc2a66462ad4efbb16d&" alt="Dashboard do Sistema" width="90%">
</p>

---

### 📊 Painel Administrativo

> Dashboard centralizado com métricas financeiras e controle de fluxo em tempo real.

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1233807998007382149/1487987186438770728/image.png?ex=69cb238e&is=69c9d20e&hm=2f08fa22c00ee8a28930c5ce8ce8f5b41c2c3d7b406ae457392d1f08808fe964&" alt="Dashboard do Sistema" width="90%">
</p>

---

## 🏗️ Arquitetura do Projeto (MVC)

O sistema segue o padrão **MVC**, separando as responsabilidades para facilitar a manutenção e testes:

- **Model (`app/src/model`)**: Camada de persistência. Gerencia a conexão com o banco de dados e as entidades (Usuário, Registro).
- **View (`app/src/view`)**: Camada de interface. Contém os templates HTML/CSS que entregam a experiência visual ao usuário.
- **Controller (`app/src/controller`)**: Camada de inteligência. Processa as requisições, valida regras de negócio e decide qual resposta enviar.

---

## 🛠️ Stack Tecnológica

- **Backend**: Node.js & Express.
- **Segurança**: Bcrypt (Hash de senhas) & Express-Session.
- **Frontend**: HTML5, CSS3, JavaScript (ES6+).
- **Interface**: Toastify-JS para alertas e Google Fonts (Inter).
- **Banco de Dados**: MySQL.

---

## 📁 Estrutura de Diretórios

```plaintext
├── .qodo/                 # Ferramentas de análise de código
├── app/src/
│   ├── auth/              # Middlewares de segurança e validação de sessão
│   ├── config/            # Configurações globais e scripts SQL
│   ├── controller/        # Controladores de rotas (Login, Movimentações)
│   ├── model/             # Abstração de dados e conexão com Banco
│   ├── public/            # Ativos estáticos (Imagens, CSS, JS Cliente)
│   ├── router/            # Definição centralizada de endpoints (rotas.js)
│   └── view/              # Telas da aplicação (HTML)
├── .env                   # Variáveis sensíveis (Banco, Segredos)
├── app.js                 # Configuração do servidor Express
└── server.js              # Inicialização do servidor Node.js


    ⚙️ Instalação e Configuração
    Siga os passos abaixo para configurar o ambiente de execução em sua máquina local.

    1. Clonar o Repositório
    Abra o terminal na pasta desejada e execute:

    Bash
    git clone https://github.com/GustavoGarcia1010/ControleDeGastos.git
    cd SeuRepositorio
    2. Instalar Dependências
    Certifique-se de ter o Node.js instalado e rode:

    Bash
    npm install
    3. Configurar Variáveis de Ambiente
    Crie um arquivo chamado .env na raiz do projeto e preencha com suas credenciais:

    Snippet de código
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=sua_senha
    DB_NAME=seu_banco
    SESSION_SECRET=chave_mestra_secreta

    4. Executar o Sistema
    Escolha o modo de execução ideal para sua necessidade:

    Bash
    # Para desenvolvimento (com auto-reload via Nodemon/TSX)
    npm run dev

    # Para produção (execução padrão)
    npm start
```
