const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 5000;


app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

app.use(express.json());

// Aquí vamos a conectar la base de datos en algún momento
/*const users = [
  {
    username: 'mdaniela.rodriguez@udea.edu.co',
    password: bcrypt.hashSync('udea2024', 10),
  },
];*/

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Daniela04.',
  database: 'atv'
});

module.exports = {
pool
};

// Ruta de Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.pool.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
    const user = rows[0];


      if (!user) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ message: 'Contraseña incorrecta'   
});
      }

      // Genera el token JWT (asegúrate de adaptar el payload y la clave secreta)
      const token = jwt.sign({ userId: user.id }, 'tu_clave_secreta', { expiresIn: '1h' });

      res.json({ token });
  } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});