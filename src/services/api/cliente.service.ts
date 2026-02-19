// ============================================
// SERVIÇO DE API - PORTAL CLIENTE
// Instituto Barros - Integração com Backend .NET 8
// ============================================

import type {
  LoginClienteRequest,
  LoginResponse,
  SolicitarResetSenhaRequest,
  SolicitarResetSenhaResponse,
  ResetarSenhaRequest,
  ResetarSenhaResponse,
  ClientePerfilResponse,
  ClienteUpdateProfileRequest,
  MinhasConsultasResponse,
  SolicitarAgendamentoRequest,
  SolicitarAgendamentoResponse,
  ConfirmarConsultaResponse,
  CancelarConsultaRequest,
  CancelarConsultaResponse,
  HistoricoResponse,
  ApiError,
} from "./types";

// ===== CONFIGURAÇÃO =====

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5101/api";

// ===== HELPERS =====

/**
 * Obter token JWT do localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

/**
 * Salvar token JWT no localStorage
 */
function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

/**
 * Remover token JWT do localStorage
 */
function removeAuthToken(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
}

/**
 * Fazer requisição HTTP com tratamento de erros
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !endpoint.includes("/LoginCliente") && !endpoint.includes("/SolicitarResetSenha") && !endpoint.includes("/ResetarSenha")) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Tratamento de erros HTTP
  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;
    let errors: string[] = [];

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.Message || errorMessage;
      errors = errorData.errors || errorData.Errors || [];
    } catch {
      // Erro ao parsear JSON, usar mensagem padrão
      if (response.status === 401) {
        errorMessage = "Não autorizado. Faça login novamente.";
        removeAuthToken();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/sign-in";
        }
      } else if (response.status === 403) {
        errorMessage = "Acesso negado.";
      } else if (response.status === 404) {
        errorMessage = "Recurso não encontrado.";
      } else if (response.status >= 500) {
        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
      }
    }

    const error: ApiError = {
      message: errorMessage,
      errors,
      statusCode: response.status,
    };

    throw error;
  }

  // Retornar JSON (ou null se 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============================================
// SERVIÇOS DE AUTENTICAÇÃO
// ============================================

/**
 * Login de cliente usando CPF e senha
 * @endpoint POST /api/User/LoginCliente
 */
export async function loginCliente(
  cpf: string,
  senha: string
): Promise<LoginResponse> {
  const data = await fetchApi<LoginResponse>("/User/LoginCliente", {
    method: "POST",
    body: JSON.stringify({ cpf, senha } as LoginClienteRequest),
  });

  // Salvar token no localStorage
  setAuthToken(data.token);
  localStorage.setItem("userName", data.userName);
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("isAuthenticated", "true");

  return data;
}

/**
 * Solicitar reset de senha (Etapa 1)
 * @endpoint POST /api/User/SolicitarResetSenha
 */
export async function solicitarResetSenha(
  cpf: string,
  email: string
): Promise<SolicitarResetSenhaResponse> {
  return fetchApi<SolicitarResetSenhaResponse>("/User/SolicitarResetSenha", {
    method: "POST",
    body: JSON.stringify({ cpf, email } as SolicitarResetSenhaRequest),
  });
}

/**
 * Resetar senha usando token (Etapa 2)
 * @endpoint POST /api/User/ResetarSenha
 */
export async function resetarSenha(
  data: ResetarSenhaRequest
): Promise<ResetarSenhaResponse> {
  return fetchApi<ResetarSenhaResponse>("/User/ResetarSenha", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Logout - limpar dados locais
 */
export function logout(): void {
  removeAuthToken();
}

// ============================================
// SERVIÇOS DE PERFIL DO CLIENTE
// ============================================

/**
 * Obter perfil do cliente logado
 * @endpoint GET /api/Cliente/MeuPerfil
 */
export async function getMeuPerfil(): Promise<ClientePerfilResponse> {
  return fetchApi<ClientePerfilResponse>("/Cliente/MeuPerfil", {
    method: "GET",
  });
}

/**
 * Atualizar dados do perfil
 * @endpoint PUT /api/Cliente/AtualizarPerfil
 */
export async function atualizarPerfil(
  data: ClienteUpdateProfileRequest
): Promise<void> {
  return fetchApi<void>("/Cliente/AtualizarPerfil", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============================================
// SERVIÇOS DE CONSULTAS/AGENDAMENTOS
// ============================================

/**
 * Listar consultas do cliente logado
 * @endpoint GET /api/Cliente/MinhasConsultas
 */
export async function getMinhasConsultas(params?: {
  dataInicio?: string;
  dataFim?: string;
}): Promise<MinhasConsultasResponse> {
  const queryParams = new URLSearchParams();

  if (params?.dataInicio) queryParams.append("dataInicio", params.dataInicio);
  if (params?.dataFim) queryParams.append("dataFim", params.dataFim);

  const query = queryParams.toString();
  const endpoint = `/Cliente/MinhasConsultas${query ? `?${query}` : ""}`;

  return fetchApi<MinhasConsultasResponse>(endpoint, {
    method: "GET",
  });
}

/**
 * Solicitar novo agendamento
 * @endpoint POST /api/Cliente/SolicitarAgendamento
 */
export async function solicitarAgendamento(
  data: SolicitarAgendamentoRequest
): Promise<SolicitarAgendamentoResponse> {
  return fetchApi<SolicitarAgendamentoResponse>(
    "/Cliente/SolicitarAgendamento",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Confirmar consulta
 * @endpoint PUT /api/Cliente/ConfirmarConsulta/{id}
 */
export async function confirmarConsulta(
  consultaId: string
): Promise<ConfirmarConsultaResponse> {
  return fetchApi<ConfirmarConsultaResponse>(
    `/Cliente/ConfirmarConsulta/${consultaId}`,
    {
      method: "PUT",
    }
  );
}

/**
 * Cancelar consulta
 * @endpoint DELETE /api/Cliente/CancelarConsulta/{id}
 */
export async function cancelarConsulta(
  consultaId: string,
  motivo?: string
): Promise<CancelarConsultaResponse> {
  return fetchApi<CancelarConsultaResponse>(
    `/Cliente/CancelarConsulta/${consultaId}`,
    {
      method: "DELETE",
      body: JSON.stringify({ motivo } as CancelarConsultaRequest),
    }
  );
}

// ============================================
// SERVIÇOS DE HISTÓRICO
// ============================================

/**
 * Obter histórico de atendimentos do cliente
 * @endpoint GET /api/Cliente/MeuHistorico
 */
export async function getMeuHistorico(): Promise<HistoricoResponse> {
  return fetchApi<HistoricoResponse>("/Cliente/MeuHistorico", {
    method: "GET",
  });
}

// ============================================
// EXPORT DEFAULT
// ============================================

const clienteApiService = {
  // Auth
  loginCliente,
  solicitarResetSenha,
  resetarSenha,
  logout,

  // Perfil
  getMeuPerfil,
  atualizarPerfil,

  // Consultas
  getMinhasConsultas,
  solicitarAgendamento,
  confirmarConsulta,
  cancelarConsulta,

  // Histórico
  getMeuHistorico,
};

export default clienteApiService;
