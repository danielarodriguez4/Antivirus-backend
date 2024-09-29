const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 5000;

// CORS configuration to allow requests from the specified origin
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

// Middleware to parse JSON bodies in requests
app.use(express.json());

// In-memory user data (you will replace this with a database in the future)
const users = [
  {
    username: 'mdaniela.rodriguez@udea.edu.co',
    password: bcrypt.hashSync('udea2024', 10), // Password hashed
  },
  // Add more users as needed
];

// Login route
app.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);

  const { username, password } = req.body;

  // Ensure both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Faltan datos de inicio de sesión.' });
  }

  try {
    // Find the user in the in-memory users array
    const foundUser = users.find((user) => user.username === username);

    // If the user is not found
    if (!foundUser) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    
    // If the password does not match
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Generate a JWT token if the login is successful
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send a successful response back to the client with the token
    res.status(200).json({
      message: 'Login exitoso',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión.' });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
