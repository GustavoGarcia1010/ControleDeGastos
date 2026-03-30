// Importa o modelo Registro, que contém a lógica de banco de dados para os lançamentos
const Registro = require('../model/Registro');

class RegistroController {
   /**
    * Método para criar uma nova movimentação (entrada/saída)
    */
   async criar(req, res) {
    try {
        // 1. Recupera o ID do usuário que está guardado na sessão (definido no LoginController)
        const idLogado = req.session.usuarioId;

        // 2. Bloqueio de segurança: Verifica se existe um usuário autenticado.
        // Se a sessão expirou ou o usuário não logou, ele é impedido de cadastrar dados.
        if (!idLogado) {
            console.error("Tentativa de lançamento sem usuário logado!");
            return res.redirect('/Acesso?erro=sessao_expirada');
        }

        // 3. Extrai os dados enviados pelo formulário através do corpo da requisição (req.body)
        const { tipo_movimentacao, valor, descricao } = req.body;
        
        // 4. Instancia um novo objeto do modelo Registro
        const novo = new Registro();
        
        // 5. Associa o ID do usuário logado ao registro (Chave Estrangeira)
        // Isso garante que um usuário não veja ou altere os dados de outro.
        novo.usuarioId = idLogado; 
        novo.tipo = tipo_movimentacao;
        novo.valor = valor;
        novo.descricao = descricao;

        // 6. Chama o método salvar() do modelo para persistir os dados no banco
        const resultado = await novo.salvar();

        // 7. Verifica se a operação no banco de dados foi bem-sucedida
        if (resultado.success) {
            // Se deu certo, volta para o dashboard com uma mensagem de sucesso
            res.redirect('/dashboard?success=1');
        } else {
            // Se houve um erro específico do banco (ex: campo inválido), retorna o erro
            res.status(500).send("Erro no banco: " + resultado.message);
        }
    } catch (error) {
        // 8. Captura erros inesperados (ex: falha de conexão ou erro de sintaxe)
        res.status(500).send("Erro interno: " + error.message);
    }
}
}

// Exporta a instância do controlador para ser utilizada no arquivo de rotas
module.exports = new RegistroController();