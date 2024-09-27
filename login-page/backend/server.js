const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Conectar ao MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'murilo', //Colocar a senha do seu sql
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

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }
  });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
