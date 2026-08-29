import { useState } from "react";
import crearIncidencia from "./incidencia";

const listaInicial = [
  crearIncidencia(
    "Habitacion 3 sucia",
    "resuelta",
    "Pepe",
    "Se me quedo la llave dentro",
  ),
];

function IncidenciasList() {
  const [incidencias, setIncidencias] = useState(listaInicial);
  const [titulo, setTitulo] = useState("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (titulo == "") return;
          setIncidencias([
            ...incidencias,
            crearIncidencia(titulo, "En proceso"),
          ]);
        }}
      >
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </form>
      <ul>
        {incidencias.map((incidencia) => (
          <li key={incidencia.id}>
            <p>Incidencia: {incidencia.titulo}</p>
            <p>Estado: {incidencia.estado}</p>
            <p>Asignado: {incidencia.asignado}</p>
            <p>Comentario: {incidencia.comentario}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          setIncidencias([...incidencias, crearIncidencia("p", "En proceso")])
        }
      >
        Crear Incidencia
      </button>
    </div>
  );
}

export default IncidenciasList;
