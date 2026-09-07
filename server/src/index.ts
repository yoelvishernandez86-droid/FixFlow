import { pool } from "./db.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

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

app.get("/api/incidencias", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
