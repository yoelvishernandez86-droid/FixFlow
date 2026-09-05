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

const incidencias: Incidencia[] = [
  {
    id: "1",
    titulo: "Habitación 3 sucia",
    estado: "resuelta",
    asignado: "Pepe",
    comentario: "Se me quedó la llave dentro",
  },
];

app.get("/api/incidencias", (req, res) => {
  res.json(incidencias);
});

app.post("/api/incidencias", (req, res) => {
  const nuevaIncidencia: Incidencia = req.body;

  incidencias.push(nuevaIncidencia);

  res.status(201).json(nuevaIncidencia);
});

app.put("/api/incidencias/:id", (req, res) => {
  const { id } = req.params;

  const incidencia = incidencias.find((incidencia) => incidencia.id === id);

  if (!incidencia) {
    return res.status(404).json({ mensaje: "Incidencia no encontrada" });
  }

  Object.assign(incidencia, req.body);

  res.json(incidencia);
});

app.delete("/api/incidencias/:id", (req, res) => {
  const { id } = req.params;

  const indice = incidencias.findIndex((incidencia) => incidencia.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Incidencia no encontrada",
    });
  }

  incidencias.splice(indice, 1);

  res.json({
    mensaje: "Incidencia eliminada",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
