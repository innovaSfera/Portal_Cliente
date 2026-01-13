export interface ScheduleResponseDto {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string; // DateTime convertido para string
  dataFim: string; // DateTime convertido para string
  diaTodo: boolean;
  status: number; // EScheduleStatus como número
  idCliente?: string;
  idFuncionario?: string;
  filialId?: string;
  localizacao?: string;
  observacao?: string;
  notificar?: boolean;
  minutosAntesNotificacao?: number;
  usuarioResponsavelId?: string;
  dataCadastro?: string;
  
  // Objetos relacionados (se a API incluir)
  cliente?: {
    id: string;
    nome: string;
    cpf?: string;
  };
  funcionario?: {
    id: string;
    nome: string;
  };
}
