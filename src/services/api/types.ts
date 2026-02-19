// ============================================
// TYPES E INTERFACES - PORTAL CLIENTE
// ============================================

// ===== AUTENTICAÇÃO =====

export interface LoginClienteRequest {
  cpf: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  userName: string;
  email: string;
}

export interface SolicitarResetSenhaRequest {
  cpf: string;
  email: string;
}

export interface SolicitarResetSenhaResponse {
  message: string;
  resetToken?: string; // Apenas em desenvolvimento
  userId?: string; // Apenas em desenvolvimento
  warning?: string;
}

export interface ResetarSenhaRequest {
  userId: string;
  resetToken: string;
  novaSenha: string;
}

export interface ResetarSenhaResponse {
  message: string;
}

// ===== CLIENTE/PERFIL =====

export interface EnderecoDto {
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface ClientePerfilResponse {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  nrTelefone?: string;
  dataNascimento?: string;
  endereco?: EnderecoDto;
  rua?: string;
  numero?: string;
  cep?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  redeSocial?: string;
}

export interface ClienteUpdateProfileRequest {
  nome: string;
  email: string;
  nrTelefone?: string;
  rua?: string;
  numero?: string;
  cep?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  redeSocial?: string;
}

// ===== CONSULTAS/AGENDAMENTOS =====

export interface ConsultaResponse {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  diaTodo: boolean;
  idCliente: string;
  idFuncionario?: string;
  localizacao: string;
  observacao: string;
  status: number;
  cliente?: {
    nome: string;
    email: string;
    cpf: string;
  };
  funcionario?: {
    nome: string;
    cargo?: string;
  };
}

// Backend retorna array simples, não objeto paginado
export type MinhasConsultasResponse = ConsultaResponse[];

export interface SolicitarAgendamentoRequest {
  dataHora: string;
  idServico: string;
  observacoes?: string;
}

export interface SolicitarAgendamentoResponse {
  id: string;
  status: number;
  statusDescricao: string;
  message: string;
}

export interface ConfirmarConsultaResponse {
  message: string;
  novoStatus: number;
  novoStatusDescricao: string;
}

export interface CancelarConsultaRequest {
  motivo?: string;
}

export interface CancelarConsultaResponse {
  message: string;
  novoStatus: number;
  novoStatusDescricao: string;
}

// ===== HISTÓRICO =====

export interface AtendimentoHistoricoResponse {
  id: string;
  referencia?: string;
  status: number; // EOrderServiceStatus
  qtdSessaoTotal?: number;
  qtdSessaoRealizada?: number;
  precoOrdem?: number;
  precoDescontado?: number;
  descontoPercentual?: number;
  formaPagamento: number; // EPaymentMethod
  dataPagamento?: string;
  dataConclusaoServico?: string;
  funcionario?: {
    nome: string;
    cargo?: string;
  };
  cliente?: {
    nome: string;
    email: string;
    cpf: string;
  };
  servicos?: Array<{
    id: string;
    nome: string;
    descricao?: string;
    preco?: number;
  }>;
  sessoes?: Array<{
    id: string;
    data: string;
    observacoes?: string;
  }>;
}

// Backend retorna array simples
export type HistoricoResponse = AtendimentoHistoricoResponse[];

// ===== ERRO =====

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode: number;
}
