import { useState } from "react";
import { type EstadoIncidencia, type Incidencia } from "./incidencia";

type Props = {
  incidencia: Incidencia;
  onActualizada: (incidencia: Incidencia) => void;
  onSesionExpirada: () => void;
};

function EditarIncidenciaTrabajador({
  incidencia,
  onActualizada,
  onSesionExpirada,
}: Props) {
  const [estado, setEstado] = useState<EstadoIncidencia>(incidencia.estado);

  const [comentario, setComentario] = useState(incidencia.comentario ?? "");

  const guardarCambios = async () => {
    try {
      const token = localStorage.getItem("token");

      const respuesta = await fetch(
        `https://fixflow-production-8cda.up.railway.app/api/incidencias/${incidencia.id}/trabajador`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estado,
            comentario,
          }),
        },
      );

      if (respuesta.status === 401) {
        onSesionExpirada();
        return;
      }

      if (!respuesta.ok) {
        alert("No se pudo actualizar la incidencia");
        return;
      }

      const incidenciaActualizada = await respuesta.json();

      onActualizada(incidenciaActualizada);
    } catch {
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="worker-edit">
      <div className="form-field">
        <label>Estado</label>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoIncidencia)}
        >
          <option value="asignada">Asignada</option>
          <option value="en proceso">En proceso</option>
          <option value="resuelta">Resuelta</option>
        </select>
      </div>

      <div className="form-field">
        <label>Comentario</label>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
      </div>

      <button type="button" className="primary-button" onClick={guardarCambios}>
        Guardar cambios
      </button>
    </div>
  );
}

export default EditarIncidenciaTrabajador;
