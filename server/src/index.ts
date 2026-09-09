import { pool } from "./db.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const jwtSecretEnv = process.env.JWT_SECRET;

if (!jwtSecretEnv) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

const JWT_SECRET: string = jwtSecretEnv;

function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, JWT_SECRET);

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o caducado",
    });
  }
}

type Incidencia = {
  id: string;
  titulo: string;
  estado: string;
  asignado?: string;
  comentario?: string;
};

app.get("/", (req, res) => {
  res.send("Servidor de FixFlow funcionando");
});

app.get("/api/incidencias", verificarToken, async (req, res) => {
  const resultado = await pool.query("SELECT * FROM incidencias");

  res.json(resultado.rows);
});

app.post("/api/incidencias", async (req, res) => {
  const nuevaIncidencia: Incidencia = req.body;

  const resultado = await pool.query(
    `INSERT INTO incidencias (id, titulo, estado, asignado, comentario)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      nuevaIncidencia.id,
      nuevaIncidencia.titulo,
      nuevaIncidencia.estado,
      nuevaIncidencia.asignado,
      nuevaIncidencia.comentario,
    ],
  );

  res.status(201).json(resultado.rows[0]);
});

app.put("/api/incidencias/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, estado, asignado, comentario } = req.body;

  const resultado = await pool.query(
    `UPDATE incidencias
     SET titulo = $1,
         estado = $2,
         asignado = $3,
         comentario = $4
     WHERE id = $5
     RETURNING *`,
    [titulo, estado, asignado, comentario, id],
  );

  if (resultado.rows.length === 0) {
    return res.status(404).json({
      mensaje: "Incidencia no encontrada",
    });
  }

  res.json(resultado.rows[0]);
});

app.delete("/api/incidencias/:id", async (req, res) => {
  const { id } = req.params;

  const resultado = await pool.query(
    `DELETE FROM incidencias
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  if (resultado.rows.length === 0) {
    return res.status(404).json({
      mensaje: "Incidencia no encontrada",
    });
  }

  res.json({
    mensaje: "Incidencia eliminada",
  });
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const id = randomUUID();

    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (id, nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, rol`,
      [id, nombre, email, passwordHash, rol],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el usuario",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await pool.query(
      `SELECT id,nombre,email,password_hash,rol 
      From usuarios
      WHERE email = $1`,
      [email],
    );

    if (resultado.rows.length === 0) {
      return res
        .status(401)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }
    const usuario = resultado.rows[0];
    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password_hash,
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "email o contraseña incorrectos",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al iniciar sesiòn" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
