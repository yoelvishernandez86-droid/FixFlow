import { type EstadoIncidencia, type Incidencia } from "./incidencia";
import FormularioDeIncidencia from "./formularioDeIncidencia";

type PropsParaModal = {
  incidencia: Incidencia;
  cerrarModal: () => void;
  onModificarIncidencia: (
    id: string,
    titulo: string,
    estado: EstadoIncidencia,
    trabajador: string,
    comentario: string,
  ) => void;
};

function ModalEditarIncidencia({
  incidencia,
  cerrarModal,
  onModificarIncidencia,
}: PropsParaModal) {
  const modificarIncidencia = (
    titulo: string,
    estado: EstadoIncidencia,
    trabajador: string,
    comentario: string,
  ) => {
    onModificarIncidencia(
      incidencia.id,
      titulo,
      estado,
      trabajador,
      comentario,
    );

    cerrarModal();
  };

  return (
    <div>
      <h2>Modificar incidencia</h2>

      <FormularioDeIncidencia
        onGuardar={modificarIncidencia}
        modo="editar"
        incidenciaInicial={incidencia}
      />

      <button onClick={cerrarModal}>Cerrar</button>
    </div>
  );
}

export default ModalEditarIncidencia;
