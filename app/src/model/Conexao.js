//faço a requisição do módulo dotoenv para fazer as leituras dos dados do arquivo .env, mantendo as informações sensíveis como a senha do banco de dados e a chave secreta fora do código
require('dotenv').config(); 
//faço a atribuição do módulo mysql2/promise para lidar com a conexão ao banco de dados MySQL usando Promises, o que facilita o uso de async/await para operações assíncronas
const mysql = require('mysql2/promise');

//crio a classe Conexao para gerenciar a conexão com o banco de dados, utilizando um pool de conexões para melhorar o desempenho e a escalabilidade da aplicação
class Conexao {
    //crio o método construtor para configurar o pool de conexões com os dados do banco de dados, utilizando as variáveis de ambiente definidas no arquivo .env para manter as informações sensíveis seguras
    constructor() {
        //configuro o pool de conexões com os dados do banco de dados, utilizando as variáveis de ambiente definidas no arquivo .env para manter as informações sensíveis seguras
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    // Sugestão: Retorne o resultado bruto para que o Model decida o que usar
    async query(sql, params) {
        try {
            // Removi a desestruturação aqui para dar flexibilidade ao Model
            const result = await this.pool.execute(sql, params);
            return result; // Isso retorna [rows, fields]
        } catch (error) {
            console.error("Erro na execução da Query:", error.message);
            throw error; // Repassa o erro para o Controller tratar
        }
    }
}

module.exports = new Conexao();