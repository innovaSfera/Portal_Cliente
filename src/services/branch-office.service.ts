import apiInstance from './api-client';
import { BranchOfficeResponseDto } from '@/types/dto/response/branch-office-response.dto';
import { AxiosError } from 'axios';

class BranchOfficeService {
  /**
   * Busca todas as unidades (filiais) ativas
   * @returns Lista de unidades
   */
  async getAllBranchOffices(): Promise<BranchOfficeResponseDto[]> {
    try {
      const response = await apiInstance.get<BranchOfficeResponseDto[]>(
        '/BranchOffice'
      );

      return response.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        // Se retornar 204 (NoContent), significa que não há unidades
        if (error.response?.status === 204) {
          return [];
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar unidades.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca uma unidade específica por ID
   * @param id - ID da unidade
   * @returns Dados da unidade
   */
  async getBranchOfficeById(id: string): Promise<BranchOfficeResponseDto | null> {
    try {
      const response = await apiInstance.get<BranchOfficeResponseDto>(
        `/BranchOffice/${id}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar unidade.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }
}

export const branchOfficeService = new BranchOfficeService();
