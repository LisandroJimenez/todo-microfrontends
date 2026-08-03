export interface UpdateTodoRequest {
  titulo: string;
  descripcion?: string;
  completado: boolean;
}