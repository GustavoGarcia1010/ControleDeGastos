
// faço a atribuição com o caminho correto para o app.js, que já tem a configuração do express e dos middlewares
const app = require('./app/src/app');; 

//pego os dados do .env e defino a porta do servidor, caso não tenha uma variável de ambiente PORT, ele usará a porta 3000
const PORT = process.env.PORT || 3000;

// Agora o 'app' já conhece a pasta public e os middlewares
app.listen(PORT, () => {
    console.log(`Server rodando em: http://localhost:${PORT}`);
});