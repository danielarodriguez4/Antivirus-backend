const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Habilita CORS para las solicitudes del front 

const app = express();
const port = 3000;

// configuración CORS para conectar con el front 
app.use(
  cors({
    origin: ['http://localhost:3000'], // URL del front
    credentials: true, // 
  })
);

// este es un ejemplo para un solo usuario
const user = {
  username: 'mdaniela.rodriguez@udea.edu.co',
  password: bcrypt.hashSync('udea2024', 10), // encripta la clave
};


app.use(express.json());

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan datos de inicio de sesión.' });
  }

  try {
    // Revisa si existe el usuario
    if (username !== user.username) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Genera el token jwt
    const token = jwt.sign({ userId: 1 }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});