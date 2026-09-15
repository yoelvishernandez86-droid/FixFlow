export type EstadoIncidencia =
  | "pendiente de asignacion"
  | "asignada"
  | "en proceso"
  | "resuelta";

export interface Incidencia {
  id: string;
  titulo: string;
  estado: EstadoIncidencia;
  asignado?: string;
  comentario?: string;
  asignado_id?: string;
}

export const crearIncidencia = (
  titulo: string,
  estado: EstadoIncidencia,
  asignado: string = "",
  asignadoId: string = "",
  comentario: string = "",
): Incidencia => {
  return {
    id: crypto.randomUUID(),
    titulo,
    estado,
    asignado,
    asignado_id: asignadoId,
    comentario,
  };
};

export default crearIncidencia;
