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
      <label htmlFor="title">Incidencia</label>
      <input
        id="title"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <label htmlFor="state">Estado</label>
      <select
        id="state"
        value={estado}
        onChange={(e) => setEstado(e.target.value as EstadoIncidencia)}
      >
        <option value="pendiente de asignacion">Pendiente de asignación</option>
        <option value="asignada">Asignada</option>
        <option value="en proceso">En proceso</option>
        <option value="resuelta">Resuelta</option>
      </select>

      <label htmlFor="worker">Trabajador</label>
      <input
        id="worker"
        type="text"
        value={trabajador}
        onChange={(e) => setTrabajador(e.target.value)}
      />

      <label htmlFor="commentary">Comentario</label>
      <textarea
        id="commentary"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button type="submit">
        {modo === "crear" ? "Crear incidencia" : "Modificar incidencia"}
      </button>
    </form>
  );
}

export default FormularioDeIncidencia;
