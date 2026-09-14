import { useState } from "react";
import { type EstadoIncidencia } from "./incidencia";
import { type Incidencia } from "./incidencia";
type FormularioDeIncidenciaProps = {
  onGuardar: (
    titulo: string,
    estado: EstadoIncidencia,
    trabajadorId: string,
    comentario: string,
  ) => void;

  trabajadores: Trabajador[];
  modo: "crear" | "editar";
  incidenciaInicial?: Incidencia;
};

type Trabajador = {
  id: string;
  nombre: string;
  email: string;
};

function FormularioDeIncidencia({
  onGuardar,
  modo,
  incidenciaInicial,
  trabajadores,
}: FormularioDeIncidenciaProps) {
  const [titulo, setTitulo] = useState(incidenciaInicial?.titulo ?? "");
  const [estado, setEstado] = useState<EstadoIncidencia>(
    incidenciaInicial?.estado ?? "pendiente de asignacion",
  );
  const [trabajadorId, setTrabajadorId] = useState(
    incidenciaInicial?.asignado_id ?? "",
  );
  const [comentario, setComentario] = useState(
    incidenciaInicial?.comentario ?? "",
  );

  return (
    <form
      className="incidencia-form"
      title="Datos de incidencia"
      onSubmit={(e) => {
        e.preventDefault();

        if (titulo.trim() === "") return;

        onGuardar(titulo.trim(), estado, trabajadorId, comentario.trim());

        setTitulo("");
        setEstado("pendiente de asignacion");
        setTrabajadorId("");
        setComentario("");
      }}
    >
      <div className="form-heading">
        <span className="form-kicker">
          {modo === "crear" ? "Nueva incidencia" : "Editar incidencia"}
        </span>
        <h2>{modo === "crear" ? "Registrar caso" : "Actualizar datos"}</h2>
      </div>

      <div className="form-field">
        <label htmlFor="title">Incidencia</label>
        <input
          id="title"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Describe el problema"
        />
      </div>

      <div className="form-field">
        <label htmlFor="state">Estado</label>
        <select
          id="state"
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoIncidencia)}
        >
          <option value="pendiente de asignacion">
            Pendiente de asignación
          </option>
          <option value="asignada">Asignada</option>
          <option value="en proceso">En proceso</option>
          <option value="resuelta">Resuelta</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="worker">Trabajador</label>

        <select
          id="worker"
          value={trabajadorId}
          onChange={(e) => setTrabajadorId(e.target.value)}
        >
          <option value="">Sin asignar</option>

          {trabajadores.map((trabajador) => (
            <option key={trabajador.id} value={trabajador.id}>
              {trabajador.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="commentary">Comentario</label>
        <textarea
          id="commentary"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Añade contexto o avances"
        />
      </div>

      <button className="primary-button" type="submit">
        {modo === "crear" ? "Crear incidencia" : "Modificar incidencia"}
      </button>
    </form>
  );
}

export default FormularioDeIncidencia;
