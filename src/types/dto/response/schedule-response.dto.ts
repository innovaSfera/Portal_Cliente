export interface ScheduleResponseDto {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  status: string;
  tipoAgendamento: string;
  customerId?: string;
  customerNome?: string;
  employeeId?: string;
  employeeNome?: string;
  branchOfficeId?: string;
  branchOfficeNome?: string;
  servicoId?: string;
  servicoNome?: string;
  observacoes?: string;
  dataCadastro: string;
}
