const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // Altere para a senha do seu MySQL
  database: 'mydb'
});

// Cadastro de usuário
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role],
    (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(201).json({ message: 'User registered!' });
    }
  );
});

// Login de usuário
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(400).json({ message: 'Password incorrect' });

      const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
      res.json({ token, role: user.role });
    });
  });
});

// Middleware para autenticar e autorizar o acesso
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token.split(' ')[1], 'secretkey', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admins only' });
  next();
};

// Rota para administradores
app.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});