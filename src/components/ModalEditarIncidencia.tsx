import { type EstadoIncidencia, type Incidencia } from "./incidencia";
import FormularioDeIncidencia from "./formularioDeIncidencia";

type PropsParaModal = {
  incidencia: Incidencia;
  trabajadores: Trabajador[];
  cerrarModal: () => void;
  onModificarIncidencia: (
    id: string,
    titulo: string,
    estado: EstadoIncidencia,
    trabajadorId: string,
    comentario: string,
  ) => void;
};

type Trabajador = {
  id: string;
  nombre: string;
  email: string;
};

function ModalEditarIncidencia({
  incidencia,
  cerrarModal,
  onModificarIncidencia,
  trabajadores,
}: PropsParaModal) {
  const modificarIncidencia = (
    titulo: string,
    estado: EstadoIncidencia,
    trabajadorId: string,
    comentario: string,
  ) => {
    onModificarIncidencia(
      incidencia.id,
      titulo,
      estado,
      trabajadorId,
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
          ></button>
        </div>

        <FormularioDeIncidencia
          onGuardar={modificarIncidencia}
          modo="editar"
          incidenciaInicial={incidencia}
          trabajadores={trabajadores}
        />
      </div>
    </div>
  );
}

export default ModalEditarIncidencia;
