const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Adicione o cors

const app = express();
app.use(express.json());
app.use(cors()); // Habilitar CORS

const PORT = 3000; // Ou qualquer porta livre
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


// Conectar ao MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'user1232024', //Colocar a senha do seu MySQL
  database: 'projbase' //Nome do Schema para teste
});

// Conectar ao MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    // Verifica se username e password foram enviados
    return res.status(400).json({ message: 'Por favor, forneça username e password' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Erro na consulta ao MySQL:', err);
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }

    if (results.length > 0) {
      // Usuário encontrado
      return res.status(200).json({ message: 'Login bem-sucedido' });
      
    } else {
      // Usuário não encontrado
      return res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }
  });
});