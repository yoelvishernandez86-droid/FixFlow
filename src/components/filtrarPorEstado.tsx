type PropFiltroEstado = {
  estadoSeleccionado: string;
  onCambiarEstado: (estado: string) => void;
};

function FiltroEstado({
  estadoSeleccionado,
  onCambiarEstado,
}: PropFiltroEstado) {
  return (
    <div className="filtro-estado">
      <label className="filtro-estado-label" htmlFor="estado-filtro">
        Filtrar por estado
      </label>
      <select
        id="estado-filtro"
        className="filtro-estado-select"
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
    </div>
  );
}

export default FiltroEstado;
