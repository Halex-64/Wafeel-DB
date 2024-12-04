const mysql = require('mysql2');

// Crie a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',   // O host do seu banco de dados, normalmente é 'localhost'
    user: 'root',        // Seu nome de usuário do MySQL
    password: '1234',    // Sua senha do MySQL
    database: 'wafeel',   // Nome do banco de dados que você está utilizando
  });
  
  // Conectar ao banco de dados
  connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.stack);
      return;
    }
    console.log('Conectado ao banco de dados MySQL com o ID ' + connection.threadId);
  });

  module.exports = connection;