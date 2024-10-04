const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pool = require('./connection-test');

const app = express();
const port = 5000;

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca al usuario en la base de datos basado en el email
    const [rows] = await pool.execute('SELECT idUsuario, password, nombre FROM usuario WHERE email = ?', [email]);
    const user = rows[0];
    console.log('Resultado de la consulta:', rows);

    // Si no se encuentra el usuario
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Verifica si el nombre se está recuperando
    if (user.nombre) {
      console.log("Nombre del usuario a enviar:", user.nombre);
    } else {
      console.error("Nombre no encontrado para el usuario.");
    }
    

    // Crea el token
    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Devuelve el token y el nombre del usuario
    console.log("Enviando token y nombre:", { token, nombre: user.nombre });
    return res.json({
      token,
      nombre: user.nombre
    });
      // Aquí debes asegurarte de que `user.nombre` no sea undefined
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


