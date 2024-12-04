const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Conexão com o banco de dados
const cors = require('cors'); // Habilitando o CORS para o frontend

const app = express();

app.use(cors());  // Permite que qualquer origem acesse a API
app.use(bodyParser.json());  // Usando o body-parser para interpretar o JSON no corpo das requisições

// Rota para login
app.post('/login', (req, res) => {
    console.log(req.body);
    const { email, senha } = req.body;

    // Verificando se os campos necessários foram passados
    if (!email || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Campos obrigatórios: email e senha'
        });
    }

    // Verificando se o email existe
    db.query(
        'SELECT * FROM Usuario WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                console.error('Erro ao verificar email:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao verificar email'
                });
            }

            // Se não encontrar o usuário
            if (results.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email ou senha inválidos'
                });
            }

            // Verificando se a senha está correta (considerando que a senha foi armazenada em texto simples, o que não é seguro)
            if (results[0].senha !== senha) {
                return res.status(400).json({
                    success: false,
                    message: 'Email ou senha inválidos'
                });
            }

            // Se o login for bem-sucedido
            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso!',
                user: results[0] // Retorna os dados do usuário (pode incluir mais informações, como o nome, role, etc)
            });
        }
    );
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
