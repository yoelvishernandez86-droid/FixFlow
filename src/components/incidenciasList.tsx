import { useState } from "react";
import {
  type EstadoIncidencia,
  type Incidencia,
  crearIncidencia,
} from "./incidencia";

import FormularioDeIncidencia from "./formularioDeIncidencia";
import ModalEditarIncidencia from "./ModalEditarIncidencia";

function IncidenciasList() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);

  const [incidenciaEditando, setIncidenciaEditando] =
    useState<Incidencia | null>(null);

  // CREAR
  const handleCrearIncidencia = (
    titulo: string,
    estado: EstadoIncidencia,
    trabajador: string,
    comentario: string,
  ) => {
    const nuevaIncidencia = crearIncidencia(
      titulo,
      estado,
      trabajador,
      comentario,
    );

    setIncidencias([...incidencias, nuevaIncidencia]);
  };

  // ELIMINAR
  const handleEliminarIncidencia = (id: string) => {
    setIncidencias(incidencias.filter((incidencia) => incidencia.id !== id));
  };

  // MODIFICAR
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
    <div className="dashboard">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">FixFlow</span>
          <h1>Gestor visual de incidencias</h1>
          <p>
            Registra, asigna y da seguimiento a cada incidencia desde una sola
            vista.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span>Total</span>
            <strong>{incidencias.length}</strong>
          </div>
          <div className="stat-card">
            <span>Abiertas</span>
            <strong>
              {
                incidencias.filter(
                  (incidencia) => incidencia.estado !== "resuelta",
                ).length
              }
            </strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <FormularioDeIncidencia
          onGuardar={handleCrearIncidencia}
          modo="crear"
        />

        <section className="incidencias-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Listado</span>
              <h2>Incidencias registradas</h2>
            </div>
          </div>

          <ul className="incidencias-list">
            {incidencias.map((incidencia) => (
              <li className="incidencia-card" key={incidencia.id}>
                <div className="incidencia-card-header">
                  <h3>{incidencia.titulo}</h3>
                  <span className="status-badge">{incidencia.estado}</span>
                </div>

                <dl className="incidencia-meta">
                  <div>
                    <dt>Asignado</dt>
                    <dd>{incidencia.asignado || "Sin asignar"}</dd>
                  </div>
                  <div>
                    <dt>Comentario</dt>
                    <dd>{incidencia.comentario || "Sin comentarios"}</dd>
                  </div>
                </dl>

                <div className="card-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setIncidenciaEditando(incidencia)}
                    type="button"
                  >
                    Modificar incidencia
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => handleEliminarIncidencia(incidencia.id)}
                    type="button"
                  >
                    Eliminar incidencia
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {incidencias.length === 0 && (
            <div className="empty-state">
              <h3>No hay incidencias todavía</h3>
              <p>Crea la primera para empezar a gestionar el flujo de trabajo.</p>
            </div>
          )}
        </section>
      </section>

      {incidenciaEditando && (
        <ModalEditarIncidencia
          incidencia={incidenciaEditando}
          cerrarModal={() => setIncidenciaEditando(null)}
          onModificarIncidencia={handleModificarIncidencia}
        />
      )}
    </div>
  );
}

export default IncidenciasList;
