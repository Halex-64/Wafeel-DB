const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Conexão com o banco de dados

const app = express();

// Configurações globais
app.use(cors()); // Permitir requisições de outros domínios
app.use(bodyParser.json()); // Interpretar JSON no corpo das requisições

/** 
 * Rota de Cadastro
 */
app.post('/usuario', (req, res) => {
    const { email, senha, nome } = req.body;

    if (!email || !senha || !nome) {
        return res.status(400).json({
            success: false,
            message: 'Campos obrigatórios: email, senha e nome'
        });
    }

    // Verificar se o email já está cadastrado
    db.query('SELECT * FROM Usuario WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar email:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao verificar email'
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email já está em uso'
            });
        }

        // Inserir o novo usuário
        db.query(
            'INSERT INTO Usuario (email, senha, nome, role, excluido) VALUES (?, ?, ?, 2, 0)',
            [email, senha, nome],
            (err) => {
                if (err) {
                    console.error('Erro ao inserir usuário:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Erro ao inserir usuário'
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'Usuário cadastrado com sucesso!'
                });
            }
        );
    });
});

/** 
 * Rota de Login
 */
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            success: false,
            message: 'Campos obrigatórios: email e senha'
        });
    }

    db.query('SELECT * FROM Usuario WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao verificar email:', err);
            return res.status(500).json({
                success: false,
                message: 'Erro ao verificar email'
            });
        }

        if (results.length === 0 || results[0].senha !== senha) {
            return res.status(400).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            user: results[0] // Informações do usuário (se necessário)
        });
    });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
