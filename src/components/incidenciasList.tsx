import { useState, useEffect } from "react";
import {
  type EstadoIncidencia,
  type Incidencia,
  crearIncidencia,
} from "./incidencia";
import EditarIncidenciaTrabajador from "./EditarIncidenciaTrabajador";
import FiltroEstado from "./filtrarPorEstado";
import FormularioDeIncidencia from "./formularioDeIncidencia";
import ModalEditarIncidencia from "./ModalEditarIncidencia";
import FiltrarPorTitulo from "./filtrarPorTitulo";

type Props = {
  onSesionExpirada: () => void;
  rol: string | null;
};

type Trabajador = {
  id: string;
  nombre: string;
  email: string;
};

function IncidenciasList({ onSesionExpirada, rol }: Props) {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [incidenciaEditando, setIncidenciaEditando] =
    useState<Incidencia | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [textoseleccionado, setTextoSeleccionado] = useState("");
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  // OBTENER
  useEffect(() => {
    const controller = new AbortController();

    const obtenerIncidencias = async () => {
      try {
        const token = localStorage.getItem("token");

        const respuesta = await fetch("https://fixflow-production-8cda.up.railway.app/api/incidencias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (respuesta.status === 401) {
          onSesionExpirada();
          return;
        }

        if (!respuesta.ok) {
          alert("No se pudieron obtener las incidencias");
          return;
        }

        const listaIncidencias = await respuesta.json();

        if (!controller.signal.aborted) {
          setIncidencias(listaIncidencias);
        }
      } catch {
        if (!controller.signal.aborted) {
          alert("No se pudo conectar con el servidor");
        }
      }
    };

    void obtenerIncidencias();

    return () => controller.abort();
  }, [onSesionExpirada]);

  useEffect(() => {
    if (rol !== "admin") return;

    const obtenerTrabajadores = async () => {
      try {
        const token = localStorage.getItem("token");

        const respuesta = await fetch(
          "https://fixflow-production-8cda.up.railway.app/api/trabajadores",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (respuesta.status === 401) {
          onSesionExpirada();
          return;
        }

        if (!respuesta.ok) {
          alert("No se pudieron obtener los trabajadores");
          return;
        }

        const listaTrabajadores = await respuesta.json();

        setTrabajadores(listaTrabajadores);
      } catch {
        alert("No se pudo conectar con el servidor");
      }
    };

    void obtenerTrabajadores();
  }, [rol, onSesionExpirada]);

  // CREAR
  const handleCrearIncidencia = async (
    titulo: string,
    estado: EstadoIncidencia,
    trabajadorId: string,
    comentario: string,
  ) => {
    try {
      const trabajadorSeleccionado = trabajadores.find(
        (trabajador) => trabajador.id === trabajadorId,
      );
      const nuevaIncidencia = crearIncidencia(
        titulo,
        estado,
        trabajadorSeleccionado?.nombre ?? "",
        trabajadorId,
        comentario,
      );

      const token = localStorage.getItem("token");

      const respuesta = await fetch("https://fixflow-production-8cda.up.railway.app/api/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaIncidencia),
      });

      if (respuesta.status === 401) {
        onSesionExpirada();
        return;
      }

      if (!respuesta.ok) {
        alert("No se pudo crear la incidencia");
        return;
      }

      const incidenciaCreada = await respuesta.json();

      setIncidencias((actuales) => [...actuales, incidenciaCreada]);
    } catch {
      alert("No se pudo conectar con el servidor");
    }
  };

  // ELIMINAR
  const handleEliminarIncidencia = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        `https://fixflow-production-8cda.up.railway.app/api/incidencias/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (respuesta.status === 401) {
        onSesionExpirada();
        return;
      }

      if (!respuesta.ok) {
        alert("No se pudo eliminar la incidencia");
        return;
      }

      setIncidencias((actuales) =>
        actuales.filter((incidencia) => incidencia.id !== id),
      );
    } catch {
      alert("No se pudo conectar con el servidor");
    }
  };

  // MODIFICAR
  const handleModificarIncidencia = async (
    id: string,
    titulo: string,
    estado: EstadoIncidencia,
    trabajadorId: string,
    comentario: string,
  ) => {
    try {
      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        `https://fixflow-production-8cda.up.railway.app/api/incidencias/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titulo,
            estado,
            asignado_id: trabajadorId || null,
            comentario,
          }),
        },
      );

      if (respuesta.status === 401) {
        onSesionExpirada();
        return;
      }

      if (!respuesta.ok) {
        alert("No se pudo modificar la incidencia");
        return;
      }

      const incidenciaModificada = await respuesta.json();

      setIncidencias((actuales) =>
        actuales.map((incidencia) =>
          incidencia.id === id ? incidenciaModificada : incidencia,
        ),
      );
    } catch {
      alert("No se pudo conectar con el servidor");
    }
  };

  const incidenciasFiltradas = incidencias.filter((incidencia) => {
    const coincideEstado =
      estadoFiltro === "todas" || incidencia.estado === estadoFiltro;

    const coincideTitulo = incidencia.titulo
      .toUpperCase()
      .startsWith(textoseleccionado.toUpperCase());

    return coincideEstado && coincideTitulo;
  });

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
        {rol === "admin" && (
          <FormularioDeIncidencia
            onGuardar={handleCrearIncidencia}
            trabajadores={trabajadores}
            modo="crear"
          />
        )}

        <section className="incidencias-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Listado</span>
              <h2>Incidencias registradas</h2>
            </div>
          </div>

          <FiltroEstado
            estadoSeleccionado={estadoFiltro}
            onCambiarEstado={setEstadoFiltro}
          />

          <FiltrarPorTitulo
            textoseleccionado={textoseleccionado}
            onCambiarTexto={setTextoSeleccionado}
          />

          <ul className="incidencias-list">
            {incidenciasFiltradas.map((incidencia) => (
              <li className="incidencia-card" key={incidencia.id}>
                <div className="incidencia-card-header">
                  <h3>{incidencia.titulo}</h3>
                  <span className="status-badge" data-status={incidencia.estado}>{incidencia.estado}</span>
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

                {rol === "admin" && (
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
                )}
                {rol === "trabajador" && (
                  <EditarIncidenciaTrabajador
                    incidencia={incidencia}
                    onSesionExpirada={onSesionExpirada}
                    onActualizada={(incidenciaActualizada) => {
                      setIncidencias((actuales) =>
                        actuales.map((item) =>
                          item.id === incidenciaActualizada.id
                            ? incidenciaActualizada
                            : item,
                        ),
                      );
                    }}
                  />
                )}
              </li>
            ))}
          </ul>

          {incidencias.length === 0 && (
            <div className="empty-state">
              <h3>No hay incidencias todavía</h3>
              <p>
                Crea la primera para empezar a gestionar el flujo de trabajo.
              </p>
            </div>
          )}
        </section>
      </section>

      {incidenciaEditando && (
        <ModalEditarIncidencia
          incidencia={incidenciaEditando}
          cerrarModal={() => setIncidenciaEditando(null)}
          onModificarIncidencia={handleModificarIncidencia}
          trabajadores={trabajadores}
        />
      )}
    </div>
  );
}

export default IncidenciasList;
