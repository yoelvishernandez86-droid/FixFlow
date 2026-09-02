import { useState } from "react";
import { type EstadoIncidencia } from "./incidencia";
import { type Incidencia } from "./incidencia";
type FormularioDeIncidenciaProps = {
  onGuardar: (
    titulo: string,
    estado: EstadoIncidencia,
    trabajador: string,
    comentario: string,
  ) => void;
  modo: "crear" | "editar";
  incidenciaInicial?: Incidencia;
};

function FormularioDeIncidencia({
  onGuardar,
  modo,
  incidenciaInicial,
}: FormularioDeIncidenciaProps) {
  const [titulo, setTitulo] = useState(incidenciaInicial?.titulo ?? "");
  const [estado, setEstado] = useState<EstadoIncidencia>(
    incidenciaInicial?.estado ?? "pendiente de asignacion",
  );
  const [trabajador, setTrabajador] = useState(
    incidenciaInicial?.asignado ?? "",
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

        onGuardar(titulo.trim(), estado, trabajador.trim(), comentario.trim());

        setTitulo("");
        setEstado("pendiente de asignacion");
        setTrabajador("");
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
        <input
          id="worker"
          type="text"
          value={trabajador}
          onChange={(e) => setTrabajador(e.target.value)}
          placeholder="Responsable asignado"
        />
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
