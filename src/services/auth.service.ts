import apiInstance, { apiClient } from './api-client';
import { LoginRequestDto } from '@/types/dto/request/login-request.dto';
import { LoginResponseDto } from '@/types/dto/response/login-response.dto';
import { AxiosError } from 'axios';

class AuthService {
  /**
   * Realiza login com CPF e senha
   * @param cpf - CPF do cliente (com ou sem máscara)
   * @param password - Senha do cliente
   * @returns Dados de autenticação com tokens
   */
  async login(cpf: string, password: string): Promise<LoginResponseDto> {
    try {
      // Remove máscara do CPF
      const cleanCpf = cpf.replace(/\D/g, '');

      const requestData: LoginRequestDto = {
        cpf: cleanCpf,
        password,
      };

      const response = await apiInstance.post<LoginResponseDto>(
        '/User/LoginCliente',  // Endpoint específico para login de cliente com CPF
        requestData
      );

      // Armazena tokens
      if (response.data.authenticated && response.data.accessToken) {
        apiClient.setToken(response.data.accessToken);
        apiClient.setRefreshToken(response.data.refreshToken);
        
        // Armazena dados do usuário
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify({
            cpf: cleanCpf,
            authenticated: true,
          }));
        }
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      return !!token;
    }
    return false;
  }

  /**
   * Retorna o CPF do usuário logado
   */
  getCurrentUserCpf(): string | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.cpf || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}

export const authService = new AuthService();
