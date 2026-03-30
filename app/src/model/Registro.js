// Importa o módulo de conexão com o banco de dados
// O 'db' é um pool de conexões, ou seja, várias conexões reutilizáveis
// isso evita abrir e fechar uma conexão nova a cada operação, melhorando a performance
const db = require('./Conexao');

// Define a classe Registro, que representa um lançamento financeiro (receita ou despesa)
class Registro {

    // O constructor é executado automaticamente quando você cria um novo objeto com 'new Registro()'
    // Aqui definimos os atributos com valores padrão usando underline (_) na frente
    // O underline é uma convenção que indica que o atributo é "privado" (não deve ser acessado diretamente)
    constructor() {
        this._usuarioId = null; // ID do usuário dono do registro
        this._tipo = '';        // Tipo do registro: 'receita' ou 'despesa'
        this._valor = 0;        // Valor monetário do registro
        this._descricao = '';   // Descrição/observação do registro
    }

    // SETTERS — são métodos especiais que permitem definir o valor dos atributos privados
    // Em vez de acessar this._usuarioId diretamente, usamos: registro.usuarioId = 1
    // Isso dá mais controle, pois podemos validar ou transformar o valor antes de salvar

    set usuarioId(v) { this._usuarioId = v; }       // Define o ID do usuário
    set tipo(v) { this._tipo = v; }                  // Define o tipo (receita/despesa)
    set valor(v) { this._valor = parseFloat(v); }    // Converte para número decimal antes de salvar
                                                     // Ex: '10.50' vira 10.5
    set descricao(v) { this._descricao = v; }        // Define a descrição

    // Método assíncrono (async) que salva o registro no banco de dados
    // 'async' significa que esse método realiza operações que levam tempo (como acessar o banco)
    // e retorna uma Promise, ou seja, o resultado virá "no futuro"
    async salvar() {

        // SQL de inserção usando '?' como placeholders (evita SQL Injection)
        // Os valores reais serão passados separadamente no array 'values'
        const sql = "INSERT INTO Registros (UsuarioId, Tipo, Valor, Descricao) VALUES (?, ?, ?, ?)";

        // Array com os valores que substituirão os '?' na query, na mesma ordem
        const values = [this._usuarioId, this._tipo, this._valor, this._descricao];

        // try/catch: tenta executar o código dentro do 'try'
        // Se der algum erro (ex: banco fora do ar), o 'catch' captura e trata o erro
        // sem deixar o servidor travar
        try {
            // 'await' pausa a execução aqui até o banco responder
            // db.query() envia o SQL ao banco e retorna um array: [result, fields]
            // usamos desestruturação ([result]) para pegar apenas o primeiro elemento
            const [result] = await db.query(sql, values);

            // Se chegou aqui, a inserção funcionou
            // result.insertId contém o ID gerado automaticamente pelo banco para o novo registro
            return { success: true, id: result.insertId };

        } catch (error) {
            // Se ocorreu algum erro, retorna um objeto indicando falha
            // error.message contém a descrição do erro (ex: "Duplicate entry", "Connection lost")
            return { success: false, message: error.message };
        }
    }
}

// Exporta a classe para que outros arquivos possam importá-la com require()
// Ex: const Registro = require('./Registro');
module.exports = Registro;