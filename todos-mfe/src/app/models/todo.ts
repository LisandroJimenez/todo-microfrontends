export interface Todo {
  id: string;
  titulo: string;
  descripcion?: string;
  completado: boolean;
  fechaCreacion: string;
}