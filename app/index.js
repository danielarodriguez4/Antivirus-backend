const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pool = require('./connection-test');

const app = express();
const port = 5000;

// Middleware setup
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query the database for the user
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Server startup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
