type PrompParaFiltroTitulo = {
  textoseleccionado: string;
  onCambiarTexto: (texto: string) => void;
};

function FiltrarPorTitulo({
  textoseleccionado,
  onCambiarTexto,
}: PrompParaFiltroTitulo) {
  return (
    <div className="filtro-texto">
      <label className="filtro-texto-label" htmlFor="inputText">
        Filtrar por titulo
      </label>
      <input
        className="filtro-texto-input"
        type="text"
        value={textoseleccionado}
        onChange={(e) => onCambiarTexto(e.target.value)}
        id="inputText"
        placeholder="Escribe el titulo de la incidencia"
      />
    </div>
  );
}

export default FiltrarPorTitulo;
