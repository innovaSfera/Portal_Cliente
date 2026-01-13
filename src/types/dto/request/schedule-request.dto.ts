import { EScheduleStatus } from "@/types/enums/schedule-status.enum";

export interface ScheduleRequestDto {
  id?: string; // Opcional para criação, obrigatório para edição
  titulo: string;
  descricao: string;
  dataInicio: string; // ISO format (YYYY-MM-DD)
  dataFim: string; // ISO format (YYYY-MM-DD)
  horaInicio: string; // HH:mm
  horaFim: string; // HH:mm
  status: EScheduleStatus;
  tipoAgendamento: string;
  customerId: string;
  employeeId?: string;
  branchOfficeId: string;
  servicoId?: string;
  observacoes?: string;
  
  // Campos para recorrência (opcional)
  isRecorrente?: boolean;
  tipoRecorrencia?: "semanal" | "quinzenal" | "mensal";
  diasSemana?: number[]; // 0-6 (Domingo-Sábado)
  quantidadeRecorrencia?: number; // Número de repetições
}
