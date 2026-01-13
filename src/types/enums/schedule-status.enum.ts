/**
 * Enum de status de agendamento
 * Baseado no backend: EScheduleStatus
 * 
 * IMPORTANTE: Portal Cliente tem acesso limitado aos status
 * Apenas 3 status disponíveis para clientes:
 * - AConfirmar (0)
 * - ConfirmadoPeloPaciente (1)
 * - CanceladoPeloPaciente (2)
 */

export enum EScheduleStatus {
  AConfirmar = 0,
  ConfirmadoPeloPaciente = 1,
  CanceladoPeloPaciente = 2,
  Concluido = 3,
  ConfirmadoPelaSaude = 4,
  Ausente = 5,
  EmAndamento = 6,
  CanceladoPelaClinica = 7,
  Reagendamento = 8,
  Encaixe = 9,
  NaoCompareceu = 10,
  AguardandoConfirmacao = 11,
}

/**
 * Status disponíveis para o Portal Cliente
 * Clientes podem apenas ver/criar estes status
 */
export const CUSTOMER_AVAILABLE_STATUS = [
  EScheduleStatus.AConfirmar,
  EScheduleStatus.ConfirmadoPeloPaciente,
  EScheduleStatus.CanceladoPeloPaciente,
];

/**
 * Labels legíveis para os status
 */
export const SCHEDULE_STATUS_LABELS: Record<EScheduleStatus, string> = {
  [EScheduleStatus.AConfirmar]: "A Confirmar",
  [EScheduleStatus.ConfirmadoPeloPaciente]: "Confirmado pelo Paciente",
  [EScheduleStatus.CanceladoPeloPaciente]: "Cancelado pelo Paciente",
  [EScheduleStatus.Concluido]: "Concluído",
  [EScheduleStatus.ConfirmadoPelaSaude]: "Confirmado pela Clínica",
  [EScheduleStatus.Ausente]: "Ausente",
  [EScheduleStatus.EmAndamento]: "Em Andamento",
  [EScheduleStatus.CanceladoPelaClinica]: "Cancelado pela Clínica",
  [EScheduleStatus.Reagendamento]: "Reagendamento",
  [EScheduleStatus.Encaixe]: "Encaixe",
  [EScheduleStatus.NaoCompareceu]: "Não Compareceu",
  [EScheduleStatus.AguardandoConfirmacao]: "Aguardando Confirmação",
};

/**
 * Cores para os status (Tailwind classes)
 */
export const SCHEDULE_STATUS_COLORS: Record<EScheduleStatus, string> = {
  [EScheduleStatus.AConfirmar]: "bg-yellow-500",
  [EScheduleStatus.ConfirmadoPeloPaciente]: "bg-green-500",
  [EScheduleStatus.CanceladoPeloPaciente]: "bg-red-500",
  [EScheduleStatus.Concluido]: "bg-blue-500",
  [EScheduleStatus.ConfirmadoPelaSaude]: "bg-teal-500",
  [EScheduleStatus.Ausente]: "bg-gray-500",
  [EScheduleStatus.EmAndamento]: "bg-purple-500",
  [EScheduleStatus.CanceladoPelaClinica]: "bg-orange-500",
  [EScheduleStatus.Reagendamento]: "bg-indigo-500",
  [EScheduleStatus.Encaixe]: "bg-pink-500",
  [EScheduleStatus.NaoCompareceu]: "bg-slate-500",
  [EScheduleStatus.AguardandoConfirmacao]: "bg-amber-500",
};

/**
 * Helper para verificar se cliente pode criar agendamento com este status
 */
export const canCustomerUseStatus = (status: EScheduleStatus): boolean => {
  return CUSTOMER_AVAILABLE_STATUS.includes(status);
};

/**
 * Helper para verificar se cliente pode editar agendamento com este status
 */
export const canCustomerEditStatus = (status: EScheduleStatus): boolean => {
  // Cliente só pode editar se status for "A Confirmar" ou "Confirmado pelo Paciente"
  return [
    EScheduleStatus.AConfirmar,
    EScheduleStatus.ConfirmadoPeloPaciente,
  ].includes(status);
};
