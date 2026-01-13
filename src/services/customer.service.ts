import apiInstance from './api-client';
import { CustomerResponseDto } from '@/types/dto/response/customer-response.dto';
import { AxiosError } from 'axios';

class CustomerService {
  /**
   * Busca informações do cliente por CPF
   * @param cpf - CPF do cliente (com ou sem máscara)
   * @returns Dados completos do cliente
   */
  async getCustomerByCpf(cpf: string): Promise<CustomerResponseDto | null> {
    try {
      // Remove máscara do CPF
      const cleanCpf = cpf.replace(/\D/g, '');

      const response = await apiInstance.get<CustomerResponseDto>(
        '/Customer/SearchCustomer',
        {
          params: {
            cpf: cleanCpf,
          },
        }
      );

      // A API retorna um objeto único
      if (response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar dados do cliente.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca informações do cliente por ID
   * @param id - ID do cliente
   * @returns Dados completos do cliente
   */
  async getCustomerById(id: string): Promise<CustomerResponseDto | null> {
    try {
      const response = await apiInstance.get<CustomerResponseDto>(
        `/Customer/${id}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar dados do cliente.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca histórico de atendimentos do cliente
   * @param customerId - ID do cliente
   * @returns Lista de históricos
   */
  async getCustomerHistory(customerId: string): Promise<any[]> {
    try {
      const response = await apiInstance.get(
        `/Customer/GetCustomerHistory/${customerId}`
      );

      return response.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar histórico do cliente.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }
}

export const customerService = new CustomerService();
