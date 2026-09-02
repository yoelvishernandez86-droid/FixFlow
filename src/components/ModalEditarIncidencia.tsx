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
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          cerrarModal();
        }
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="form-kicker">Edicion</span>
            <h2>Modificar incidencia</h2>
          </div>

          <button
            className="icon-button"
            onClick={cerrarModal}
            type="button"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <FormularioDeIncidencia
          onGuardar={modificarIncidencia}
          modo="editar"
          incidenciaInicial={incidencia}
        />
      </div>
    </div>
  );
}

export default ModalEditarIncidencia;
