type PropFiltroEstado = {
  estadoSeleccionado: string;
  onCambiarEstado: (estado: string) => void;
};

function FiltroEstado({
  estadoSeleccionado,
  onCambiarEstado,
}: PropFiltroEstado) {
  return (
    <select
      value={estadoSeleccionado}
      onChange={(e) => {
        onCambiarEstado(e.target.value);
      }}
    >
      <option value="todas">Todas</option>
      <option value="pendiente de asignacion">Pendiente</option>
      <option value="asignada">Asignada</option>
      <option value="en proceso">En proceso</option>
      <option value="resuelta">Resuelta</option>
    </select>
  );
}

export default FiltroEstado;
