import { EScheduleStatus } from "@/types/enums/schedule-status.enum";

export interface ScheduleRequestDto {
  id?: string; // Opcional para criação, obrigatório para edição
  titulo: string;
  descricao: string;
  dataInicio: string; // ISO format (YYYY-MM-DD) - será convertido para DateTime no backend
  dataFim: string; // ISO format (YYYY-MM-DD) - será convertido para DateTime no backend
  diaTodo?: boolean; // Se é evento de dia todo
  status: EScheduleStatus;
  idCliente?: string; // Cliente (customerId no frontend)
  idFuncionario?: string; // Funcionário/Fisioterapeuta (employeeId no frontend)
  filialId?: string; // Unidade/Filial (branchOfficeId no frontend)
  localizacao?: string; // Local do atendimento
  observacao?: string; // Observações
  notificar?: boolean; // Se deve notificar
  minutosAntesNotificacao?: number; // Minutos antes para notificar
  usuarioResponsavelId?: string; // Responsável
}
