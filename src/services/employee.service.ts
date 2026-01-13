import apiInstance from './api-client';
import { EmployeeResponseDto } from '@/types/dto/response/employee-response.dto';
import { AxiosError } from 'axios';

class EmployeeService {
  /**
   * Busca todos os funcionários ativos
   * @param filialId - ID da filial (opcional) para filtrar
   * @returns Lista de funcionários
   */
  async getAllEmployees(filialId?: string): Promise<EmployeeResponseDto[]> {
    try {
      const response = await apiInstance.get<EmployeeResponseDto[]>(
        '/Employee',
        {
          params: filialId ? { idFilial: filialId } : undefined,
        }
      );

      return response.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        // Se retornar 204 (NoContent), significa que não há funcionários
        if (error.response?.status === 204) {
          return [];
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar funcionários.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca funcionários de uma filial específica
   * @param filialId - ID da filial
   * @returns Lista de funcionários da filial
   */
  async getEmployeesByBranchOffice(filialId: string): Promise<EmployeeResponseDto[]> {
    return this.getAllEmployees(filialId);
  }

  /**
   * Busca um funcionário específico por ID
   * @param id - ID do funcionário
   * @returns Dados do funcionário
   */
  async getEmployeeById(id: string): Promise<EmployeeResponseDto | null> {
    try {
      const response = await apiInstance.get<EmployeeResponseDto>(
        `/Employee/${id}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar funcionário.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }
}

export const employeeService = new EmployeeService();
