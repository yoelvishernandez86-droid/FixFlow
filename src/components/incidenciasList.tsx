import { useState } from "react";
import { type EstadoIncidencia, type Incidencia } from "./incidencia";

import FormularioDeIncidencia from "./formularioDeIncidencia";
import ModalEditarIncidencia from "./ModalEditarIncidencia";

function IncidenciasList() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [incidenciaEditando, setIncidenciaEditando] =
    useState<Incidencia | null>(null);

  const handleCrearIncidencia = (
    titulo: string,
    estado: EstadoIncidencia,
    trabajador: string,
    comentario: string,
  ) => {
    const nuevaIncidencia: Incidencia = {
      id: crypto.randomUUID(),
      titulo,
      estado,
      asignado: trabajador,
      comentario,
    };

    setIncidencias([...incidencias, nuevaIncidencia]);
  };

  const handleModificarIncidencia = (
    id: string,
    titulo: string,
    estado: EstadoIncidencia,
    trabajador: string,
    comentario: string,
  ) => {
    setIncidencias(
      incidencias.map((incidencia) =>
        incidencia.id === id
          ? {
              ...incidencia,
              titulo,
              estado,
              asignado: trabajador,
              comentario,
            }
          : incidencia,
      ),
    );
  };

  return (
    <div>
      <FormularioDeIncidencia onGuardar={handleCrearIncidencia} modo="crear" />

      {incidenciaEditando && (
        <ModalEditarIncidencia
          incidencia={incidenciaEditando}
          cerrarModal={() => setIncidenciaEditando(null)}
          onModificarIncidencia={handleModificarIncidencia}
        />
      )}

      <ul>
        {incidencias.map((incidencia) => (
          <li key={incidencia.id}>
            <p>Incidencia: {incidencia.titulo}</p>
            <p>Estado: {incidencia.estado}</p>
            <p>Asignado: {incidencia.asignado}</p>
            <p>Comentario: {incidencia.comentario}</p>

            <button onClick={() => setIncidenciaEditando(incidencia)}>
              Modificar incidencia
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncidenciasList;
