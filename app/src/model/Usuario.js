// Importa o módulo de conexão com o banco de dados (pool de conexões)
const db = require('./Conexao');

// Importa o bcrypt, biblioteca usada para criptografar senhas
// NUNCA se deve salvar senha em texto puro no banco — o bcrypt transforma a senha
// em um hash irreversível, ou seja, não dá para descriptografar de volta
const bcrypt = require('bcrypt');

// Define a classe Usuario, responsável por operações relacionadas ao usuário no banco
class Usuario {

  // Método ESTÁTICO para buscar um usuário pelo e-mail
  // 'static' significa que você chama direto na classe, sem precisar criar um objeto
  // Ex: Usuario.buscarPorEmail('email@email.com')
  // 'async' porque a consulta ao banco é uma operação assíncrona (leva tempo)
  static async buscarPorEmail(email) {

    // SQL que busca todos os dados do usuário com o e-mail informado
    // '?' é o placeholder que evita SQL Injection
    const sql = 'SELECT * FROM Usuario WHERE Email = ?';

    // Executa a query passando o e-mail como valor do placeholder
    // 'await' pausa até o banco responder
    const resultados = await db.query(sql, [email]);

    // O db.query() pode retornar o resultado em formatos diferentes dependendo do driver
    // Essa linha garante que sempre vamos trabalhar com um array simples de linhas
    // Se resultados[0] for um array (formato mysql2), usa ele — senão usa resultados direto
    const linhas = Array.isArray(resultados) && Array.isArray(resultados[0])
                   ? resultados[0]   // Formato mysql2: [[linhas], [campos]]
                   : resultados;     // Outro formato: [linhas]

    // Se encontrou pelo menos um usuário com esse e-mail, retorna o primeiro (e único)
    // pois e-mail deve ser único no banco
    if (linhas && linhas.length > 0) {
        return linhas[0]; // Retorna o objeto do usuário encontrado
    }

    // Se não encontrou nenhum usuário com esse e-mail, retorna null
    return null;
  }

  // Método ESTÁTICO para criar um novo usuário no banco
  // Recebe um objeto 'dados' com as informações do usuário
  static async criar(dados) {

    // Desestruturação: extrai as propriedades nome, email e senha do objeto 'dados'
    // É o mesmo que: const nome = dados.nome; const email = dados.email; etc.
    const { nome, email, senha } = dados;

    // saltRounds define o "custo" da criptografia
    // Quanto maior o número, mais seguro e mais lento
    // 10 é o valor recomendado para a maioria das aplicações
    const saltRounds = 10;

    // Criptografa a senha usando bcrypt
    // 'await' aguarda o processo de hash, que é intencionalmente lento para dificultar ataques
    // O resultado é uma string hash como: "$2b$10$Kd9..."
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    // SQL de inserção do novo usuário
    // Salva o hash da senha, NUNCA a senha original
    const sql = 'INSERT INTO Usuario (Nome, Email, Senha) VALUES (?, ?, ?)';

    // Executa a query com os valores e retorna o resultado
    // O resultado contém informações como o ID gerado (result.insertId)
    return await db.query(sql, [nome, email, senhaCriptografada]);
  }
}

// Exporta a classe para ser usada em outros arquivos
// Ex: const Usuario = require('./Usuario');
module.exports = Usuario;