// Importa o modelo de Usuário para interagir com o banco de dados
const Usuario = require('../model/Usuario');
// Importa a biblioteca bcrypt para comparação de senhas criptografadas
const bcrypt = require('bcrypt');

class LoginController {
    
    /**
     * Lógica de Autenticação (Login)
     */
    async logar(req, res) {
        // Desestrutura os dados vindos do formulário (corpo da requisição)
        const { email, senha } = req.body;

        try {
            // Busca no banco de dados se existe um usuário com o e-mail fornecido
            const usuarioEncontrado = await Usuario.buscarPorEmail(email);

            // Se o usuário existir no banco...
            if (usuarioEncontrado) {
            
                // Compara a senha digitada com a senha criptografada (hash) do banco
                // O bcrypt.compare retorna true se as senhas coincidirem
                const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.Senha);

                if (senhaCorreta) {
                    // Cria uma sessão para o usuário guardando seu ID
                    // Isso mantém o usuário "logado" entre as páginas
                    req.session.usuarioId = usuarioEncontrado.Id;
                    
                    // Redireciona para a página principal do sistema
                    return res.redirect('/dashboard'); 
                }
            }
            
            // Se o e-mail não existir ou a senha estiver incorreta,
            // redireciona de volta para a tela de login com um código de erro
            return res.redirect('/Acesso?erro=1');
            
        } catch (erro) {
            // Caso ocorra algum erro técnico (banco fora do ar, etc)
            console.error("Erro no login:", erro);
            return res.status(500).send("Erro interno no servidor.");
        }
    }

    /**
     * Lógica de Criação de Conta (Cadastro)
     */
    async cadastrar(req, res) {
        // Recebe os dados do novo usuário
        const { nome, email, senha } = req.body;
        
        try {
            // Verifica se o e-mail já está cadastrado para evitar duplicidade
            const usuarioExistente = await Usuario.buscarPorEmail(email);

            if (usuarioExistente) {
                // Se já existir, redireciona com código de erro de "e-mail duplicado"
                return res.redirect('/Acesso?erro=2');
            }

            // Chama o método do modelo para inserir o novo usuário no banco
            // Nota: Idealmente, a senha deve ser criptografada antes de chegar aqui ou dentro do model
            await Usuario.criar({ nome, email, senha });
            
            // Redireciona indicando que a conta foi criada com sucesso
            return res.redirect('/Acesso?sucesso=1');
            
        } catch (erro) {
            // Trata falhas inesperadas no processo de cadastro
            console.error("Erro no cadastro:", erro);
            return res.status(500).send("Erro interno no servidor.");
        }
    }
} 

// Exporta uma instância da classe para ser usada nas rotas da aplicação
module.exports = new LoginController();