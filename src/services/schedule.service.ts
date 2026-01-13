import apiInstance from './api-client';
import { ScheduleResponseDto } from '@/types/dto/response/schedule-response.dto';
import { ScheduleRequestDto } from '@/types/dto/request/schedule-request.dto';
import { AxiosError } from 'axios';

class ScheduleService {
  /**
   * Busca todos os agendamentos de um cliente
   * @param customerId - ID do cliente
   * @returns Lista de agendamentos do cliente
   */
  async getSchedulesByCustomerId(customerId: string): Promise<ScheduleResponseDto[]> {
    try {
      const response = await apiInstance.get<ScheduleResponseDto[]>(
        '/Schedule',
        {
          params: {
            idCliente: customerId,
          },
        }
      );

      return response.data || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        // Se retornar 204 (NoContent), significa que não há agendamentos
        if (error.response?.status === 204) {
          return [];
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar agendamentos.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca um agendamento específico por ID
   * @param scheduleId - ID do agendamento
   * @returns Dados do agendamento
   */
  async getScheduleById(scheduleId: string): Promise<ScheduleResponseDto | null> {
    try {
      const response = await apiInstance.get<ScheduleResponseDto>(
        `/Schedule/${scheduleId}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return null;
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao buscar agendamento.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca agendamentos futuros do cliente
   * @param customerId - ID do cliente
   * @returns Lista de agendamentos futuros
   */
  async getUpcomingSchedules(customerId: string): Promise<ScheduleResponseDto[]> {
    try {
      const allSchedules = await this.getSchedulesByCustomerId(customerId);
      
      // Filtra apenas agendamentos futuros
      const now = new Date();
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.dataInicio);
        return scheduleDate >= now;
      }).sort((a, b) => {
        // Ordena por data crescente
        return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime();
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca histórico de agendamentos (passados) do cliente
   * @param customerId - ID do cliente
   * @returns Lista de agendamentos passados
   */
  async getScheduleHistory(customerId: string): Promise<ScheduleResponseDto[]> {
    try {
      const allSchedules = await this.getSchedulesByCustomerId(customerId);
      
      // Filtra apenas agendamentos passados
      const now = new Date();
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.dataInicio);
        return scheduleDate < now;
      }).sort((a, b) => {
        // Ordena por data decrescente (mais recente primeiro)
        return new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime();
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria um novo agendamento
   * @param scheduleData - Dados do agendamento a ser criado
   * @returns Agendamento criado
   */
  async createSchedule(scheduleData: ScheduleRequestDto): Promise<ScheduleResponseDto> {
    try {
      const response = await apiInstance.post<ScheduleResponseDto>(
        '/Schedule',
        scheduleData
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Erro 409 = conflito de horário
        if (error.response?.status === 409) {
          throw new Error('Conflito de horário. Já existe um agendamento neste horário.');
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao criar agendamento.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Atualiza um agendamento existente
   * @param scheduleId - ID do agendamento
   * @param scheduleData - Dados atualizados do agendamento
   * @returns Agendamento atualizado
   */
  async updateSchedule(
    scheduleId: string,
    scheduleData: ScheduleRequestDto
  ): Promise<ScheduleResponseDto> {
    try {
      const response = await apiInstance.put<ScheduleResponseDto>(
        `/Schedule`,
        { ...scheduleData, id: scheduleId }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          throw new Error('Conflito de horário. Já existe um agendamento neste horário.');
        }
        if (error.response?.status === 404) {
          throw new Error('Agendamento não encontrado.');
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao atualizar agendamento.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Deleta um agendamento
   * @param scheduleId - ID do agendamento a ser deletado
   */
  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      await apiInstance.delete(`/Schedule/${scheduleId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error('Agendamento não encontrado.');
        }
        throw new Error(
          error.response?.data?.message || 'Erro ao deletar agendamento.'
        );
      }
      throw new Error('Erro ao conectar com o servidor.');
    }
  }

  /**
   * Busca agendamentos por período
   * @param customerId - ID do cliente
   * @param startDate - Data inicial (ISO format)
   * @param endDate - Data final (ISO format)
   * @returns Lista de agendamentos no período
   */
  async getSchedulesByDateRange(
    customerId: string,
    startDate: string,
    endDate: string
  ): Promise<ScheduleResponseDto[]> {
    try {
      const allSchedules = await this.getSchedulesByCustomerId(customerId);
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.dataInicio);
        return scheduleDate >= start && scheduleDate <= end;
      }).sort((a, b) => {
        return new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime();
      });
    } catch (error) {
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
