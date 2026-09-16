import "dotenv/config";

import pool from "./db.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

const jwtSecretEnv = process.env.JWT_SECRET;

if (!jwtSecretEnv) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}

const JWT_SECRET: string = jwtSecretEnv;

type UsuarioToken = {
  id: string;
  email: string;
  rol: string;
};

type RequestConUsuario = Request & {
  usuario?: UsuarioToken;
};

function verificarToken(
  req: RequestConUsuario,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensaje: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const usuario = jwt.verify(token, JWT_SECRET) as UsuarioToken;
    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o caducado",
    });
  }
}

function soloAdmin(req: RequestConUsuario, res: Response, next: NextFunction) {
  if (!req.usuario) {
    return res.status(401).json({
      mensaje: "Debes iniciar sesión",
    });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({
      mensaje: "Solo un administrador puede realizar esta acción",
    });
  }

  next();
}

type Incidencia = {
  id: string;
  titulo: string;
  estado: string;
  asignado?: string;
  comentario?: string;
  asignado_id?: string;
};

app.get("/", (req, res) => {
  res.send("Servidor de FixFlow funcionando");
});

app.get(
  "/api/incidencias",
  verificarToken,
  async (req: RequestConUsuario, res) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    if (req.usuario.rol === "admin") {
      const resultado = await pool.query("SELECT * FROM incidencias");

      return res.json(resultado.rows);
    }

    const resultado = await pool.query(
      `SELECT *
     FROM incidencias
     WHERE asignado_id = $1`,
      [req.usuario.id],
    );

    res.json(resultado.rows);
  },
);

app.post("/api/incidencias", verificarToken, soloAdmin, async (req, res) => {
  const nuevaIncidencia: Incidencia = req.body;

  const resultado = await pool.query(
    `INSERT INTO incidencias
   (id, titulo, estado, asignado, asignado_id, comentario)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
    [
      nuevaIncidencia.id,
      nuevaIncidencia.titulo,
      nuevaIncidencia.estado,
      nuevaIncidencia.asignado,
      nuevaIncidencia.asignado_id || null,
      nuevaIncidencia.comentario,
    ],
  );

  res.status(201).json(resultado.rows[0]);
});

app.put("/api/incidencias/:id", verificarToken, soloAdmin, async (req, res) => {
  const { id } = req.params;
  const { titulo, estado, asignado_id, comentario } = req.body;

  const resultado = await pool.query(
    `UPDATE incidencias
   SET titulo = $1,
       estado = $2,
       asignado_id = $3,
       asignado = (
         SELECT nombre
         FROM usuarios
         WHERE id = $3
       ),
       comentario = $4
   WHERE id = $5
   RETURNING *`,
    [titulo, estado, asignado_id || null, comentario, id],
  );

  if (resultado.rows.length === 0) {
    return res.status(404).json({
      mensaje: "Incidencia no encontrada",
    });
  }

  res.json(resultado.rows[0]);
});

app.delete(
  "/api/incidencias/:id",
  verificarToken,
  soloAdmin,
  async (req, res) => {
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
  },
);

app.post("/api/usuarios", verificarToken, soloAdmin, async (req, res) => {
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

app.get("/api/trabajadores", verificarToken, soloAdmin, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nombre, email
         FROM usuarios
         WHERE rol = 'trabajador'
         ORDER BY nombre`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los trabajadores",
    });
  }
});

app.patch(
  "/api/incidencias/:id/trabajador",
  verificarToken,
  async (req: RequestConUsuario, res) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          mensaje: "Usuario no autenticado",
        });
      }

      if (req.usuario.rol !== "trabajador") {
        return res.status(403).json({
          mensaje: "Esta acción es solo para trabajadores",
        });
      }

      const { id } = req.params;
      const { estado, comentario } = req.body;

      const estadosPermitidos = ["asignada", "en proceso", "resuelta"];

      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
          mensaje: "Estado no permitido",
        });
      }

      const resultado = await pool.query(
        `UPDATE incidencias
         SET estado = $1,
             comentario = $2
         WHERE id = $3
           AND asignado_id = $4
         RETURNING *`,
        [estado, comentario, id, req.usuario.id],
      );

      if (resultado.rows.length === 0) {
        return res.status(403).json({
          mensaje: "No puedes modificar esta incidencia",
        });
      }

      res.json(resultado.rows[0]);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje: "Error al actualizar la incidencia",
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
