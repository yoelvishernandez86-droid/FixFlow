export type EstadoIncidencia =
  | "pendiente de asignacion"
  | "asignada"
  | "En proceso"
  | "resuelta";

export interface Incidencia {
  id: string;
  titulo: string;
  estado: EstadoIncidencia;
  asignado?: string;
  comentario?: string;
}

const crearIncidencia = (
  titulo: string,
  estado: EstadoIncidencia,
  asignado: string = "",
  comentario: string = "",
): Incidencia => {
  return {
    id: crypto.randomUUID(),
    titulo: titulo,
    estado: estado,
    asignado: asignado,
    comentario: comentario,
  };
};

export default crearIncidencia;
