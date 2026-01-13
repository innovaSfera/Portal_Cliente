"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DateSelectArg, EventInput } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ToastContainer from "@/components/ui/ToastContainer";
import CalendarSkeleton from "./CalendarSkeleton";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/auth-context";
import { scheduleService } from "@/services/schedule.service";
import { branchOfficeService } from "@/services/branch-office.service";
import { employeeService } from "@/services/employee.service";
import { ScheduleResponseDto } from "@/types/dto/response/schedule-response.dto";
import { ScheduleRequestDto } from "@/types/dto/request/schedule-request.dto";
import { BranchOfficeResponseDto } from "@/types/dto/response/branch-office-response.dto";
import { EmployeeResponseDto } from "@/types/dto/response/employee-response.dto";
import {
  EScheduleStatus,
  SCHEDULE_STATUS_LABELS,
  SCHEDULE_STATUS_COLORS,
  CUSTOMER_AVAILABLE_STATUS,
  canCustomerEditStatus,
} from "@/types/enums/schedule-status.enum";
import Select from "@/components/form/Select";
import SelectWithSearch from "@/components/form/SelectWithSearch";

interface CalendarBoxProps {
  onWhatsAppClick?: (handler: () => void) => void;
}

export default function CalendarBox({ onWhatsAppClick }: CalendarBoxProps = {}) {
  const { user } = useAuth();
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { toasts, removeToast, success, error: showError, warning } = useToast();

  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleResponseDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para opções dos selects
  const [branchOffices, setBranchOffices] = useState<BranchOfficeResponseDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeResponseDto[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Estado para confirm modal
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState<Partial<ScheduleRequestDto>>({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    status: EScheduleStatus.AConfirmar,
    diaTodo: false,
    filialId: "",
    idFuncionario: "",
    idCliente: "",
    observacao: "",
    localizacao: "",
  });
  
  // Estados auxiliares para hora (não existem no backend)
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("09:00");

  // Carregar agendamentos do cliente
  useEffect(() => {
    if (user?.id) {
      loadSchedules();
    }
  }, [user]);

  // Carregar unidades e profissionais ao montar
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        
        // Buscar unidades
        const officesData = await branchOfficeService.getAllBranchOffices();
        setBranchOffices(officesData);
        
        // Buscar todos os profissionais (serão filtrados depois)
        const employeesData = await employeeService.getAllEmployees();
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);
        
      } catch (error) {
        console.error("Erro ao carregar opções:", error);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    loadOptions();
  }, []);

  // Filtrar profissionais quando unidade mudar
  useEffect(() => {
    if (formData.filialId) {
      const filtered = employees.filter(
        emp => emp.filialId === formData.filialId
      );
      setFilteredEmployees(filtered);
      
      // Limpar profissional se não pertencer à unidade selecionada
      if (formData.idFuncionario) {
        const selectedEmpBelongsToOffice = filtered.some(
          emp => emp.id === formData.idFuncionario
        );
        if (!selectedEmpBelongsToOffice) {
          handleInputChange("idFuncionario", "");
        }
      }
    } else {
      setFilteredEmployees(employees);
    }
  }, [formData.filialId, employees]);

  const loadSchedules = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const schedules = await scheduleService.getSchedulesByCustomerId(user.id);

      // Converter para formato FullCalendar
      const calendarEvents: EventInput[] = schedules.map((schedule) => {
        // Extrair data e hora do DateTime
        const startDate = new Date(schedule.dataInicio);
        const endDate = new Date(schedule.dataFim);
        
        return {
          id: schedule.id,
          title: schedule.titulo,
          start: startDate,
          end: endDate,
          backgroundColor: getStatusColor(Number(schedule.status)),
          borderColor: getStatusColor(Number(schedule.status)),
          allDay: schedule.diaTodo || false,
          extendedProps: {
            ...schedule,
          },
        };
      });

      setEvents(calendarEvents);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
      showError("Erro ao carregar agendamentos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number): string => {
    const colorClass = SCHEDULE_STATUS_COLORS[status as EScheduleStatus];
    // Converter Tailwind class para hex color
    const colorMap: Record<string, string> = {
      "bg-yellow-500": "#eab308",
      "bg-green-500": "#22c55e",
      "bg-red-500": "#ef4444",
      "bg-blue-500": "#3b82f6",
      "bg-teal-500": "#14b8a6",
      "bg-gray-500": "#6b7280",
      "bg-purple-500": "#a855f7",
      "bg-orange-500": "#f97316",
      "bg-indigo-500": "#6366f1",
      "bg-pink-500": "#ec4899",
      "bg-slate-500": "#64748b",
      "bg-amber-500": "#f59e0b",
    };
    return colorMap[colorClass] || "#3b82f6";
  };

  // Ao clicar em uma data vazia (criar novo)
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // Limpar seleção

    setSelectedDate(selectInfo.start);
    setSelectedEvent(null);
    setIsEditing(false);

    // Preencher form com data selecionada
    const startDate = selectInfo.start.toISOString().split("T")[0];
    const startTime = selectInfo.start.toTimeString().slice(0, 5);
    const endDate = selectInfo.end.toISOString().split("T")[0];
    const endTime = selectInfo.end.toTimeString().slice(0, 5);

    setFormData({
      titulo: "",
      descricao: "",
      dataInicio: startDate,
      dataFim: endDate,
      status: EScheduleStatus.AConfirmar,
      diaTodo: false,
      filialId: "",
      idFuncionario: "",
      idCliente: user?.id || "",
      observacao: "",
      localizacao: "",
    });
    
    setHoraInicio(startTime);
    setHoraFim(endTime);

    openModal();
  };

  // Ao clicar em um evento existente (editar)
  const handleEventClick = (clickInfo: EventClickArg) => {
    const scheduleData = clickInfo.event.extendedProps as ScheduleResponseDto;

    setSelectedEvent(scheduleData);
    setIsEditing(true);

    // Preencher form com dados do evento
    const startDate = new Date(scheduleData.dataInicio);
    const endDate = new Date(scheduleData.dataFim);
    
    setFormData({
      id: scheduleData.id,
      titulo: scheduleData.titulo,
      descricao: scheduleData.descricao,
      dataInicio: startDate.toISOString().split("T")[0],
      dataFim: endDate.toISOString().split("T")[0],
      status: Number(scheduleData.status) as EScheduleStatus,
      diaTodo: scheduleData.diaTodo || false,
      filialId: scheduleData.filialId || "",
      idFuncionario: scheduleData.idFuncionario || "",
      idCliente: user?.id || "",
      observacao: scheduleData.observacao || "",
      localizacao: scheduleData.localizacao || "",
    });
    
    setHoraInicio(startDate.toTimeString().slice(0, 5));
    setHoraFim(endDate.toTimeString().slice(0, 5));

    openModal();
  };

  const handleSave = async () => {
    // Validações
    if (!formData.titulo || !formData.dataInicio) {
      warning("Preencha o título e a data.");
      return;
    }
    
    if (!formData.filialId) {
      warning("Selecione uma unidade.");
      return;
    }
    
    if (!formData.idFuncionario) {
      warning("Selecione um profissional.");
      return;
    }

    if (!user?.id) {
      showError("Usuário não autenticado.");
      return;
    }

    try {
      // Combinar data + hora para criar DateTime ISO completo
      const dataInicioCompleta = `${formData.dataInicio}T${horaInicio}:00`;
      const dataFimCompleta = `${formData.dataFim}T${horaFim}:00`;
      
      const scheduleData: ScheduleRequestDto = {
        ...formData,
        dataInicio: dataInicioCompleta,
        dataFim: dataFimCompleta,
        idCliente: user.id,
        status: formData.status || EScheduleStatus.AConfirmar,
      } as ScheduleRequestDto;

      if (isEditing && formData.id) {
        // Atualizar
        await scheduleService.updateSchedule(formData.id, scheduleData);
        success("Agendamento atualizado com sucesso!");
      } else {
        // Criar
        await scheduleService.createSchedule(scheduleData);
        success("Agendamento criado com sucesso!");
      }

      closeModal();
      loadSchedules(); // Recarregar eventos
    } catch (err: any) {
      console.error("Erro ao salvar agendamento:", err);
      showError(err.message || "Erro ao salvar agendamento. Tente novamente.");
    }
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    try {
      setIsDeleting(true);
      await scheduleService.deleteSchedule(formData.id);
      success("Agendamento excluído com sucesso!");
      setShowConfirmDelete(false);
      closeModal();
      loadSchedules();
    } catch (err: any) {
      console.error("Erro ao excluir agendamento:", err);
      showError(err.message || "Erro ao excluir agendamento. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (field: keyof ScheduleRequestDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canEdit = (): boolean => {
    if (!isEditing || !selectedEvent) return true;
    return canCustomerEditStatus(Number(selectedEvent.status) as EScheduleStatus);
  };

  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="w-full rounded-lg bg-white p-2 sm:p-4 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
        />
      </div>

      {/* Modal de Agendamento */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={isEditing ? "Editar Agendamento" : "Novo Agendamento"}
        size="lg"
      >
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              disabled={!canEdit()}
              className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ex: Consulta com Fisioterapeuta"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              disabled={!canEdit()}
              rows={3}
              className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Descreva o motivo do agendamento..."
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dataInicio}
                onChange={(e) => {
                  handleInputChange("dataInicio", e.target.value);
                  handleInputChange("dataFim", e.target.value);
                }}
                disabled={!canEdit()}
                className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Horário Início <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                disabled={!canEdit()}
                className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Horário Fim <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                disabled={!canEdit()}
                className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Status (apenas opções permitidas) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", Number(e.target.value))}
              disabled={!canEdit()}
              className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {CUSTOMER_AVAILABLE_STATUS.map((status) => (
                <option key={status} value={status}>
                  {SCHEDULE_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          {/* Unidade (Filial) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Unidade <span className="text-red-500">*</span>
            </label>
            <Select
              options={branchOffices.map(office => ({
                value: office.id,
                label: office.nomeFilial,
              }))}
              value={formData.filialId || ""}
              onChange={(value) => handleInputChange("filialId", value)}
              placeholder="Selecione a unidade"
              disabled={!canEdit() || loadingOptions}
              required
            />
          </div>

          {/* Profissional (Fisioterapeuta) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Profissional <span className="text-red-500">*</span>
            </label>
            <SelectWithSearch
              options={filteredEmployees.map(emp => ({
                value: emp.id,
                label: `${emp.nome}${emp.crefito ? ` - CREFITO: ${emp.crefito}` : ''}`,
              }))}
              value={formData.idFuncionario || ""}
              onChange={(value) => handleInputChange("idFuncionario", value)}
              placeholder={formData.filialId ? "Buscar profissional..." : "Selecione uma unidade primeiro"}
              disabled={!canEdit() || loadingOptions || !formData.filialId}
              isClearable
              noOptionsMessage={formData.filialId ? "Nenhum profissional encontrado nesta unidade" : "Selecione uma unidade primeiro"}
            />
            {formData.filialId && filteredEmployees.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ Nenhum profissional disponível nesta unidade
              </p>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Observações
            </label>
            <textarea
              value={formData.observacao}
              onChange={(e) => handleInputChange("observacao", e.target.value)}
              disabled={!canEdit()}
              rows={2}
              className="w-full rounded-lg border border-stroke px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <button
              onClick={closeModal}
              className="rounded-lg bg-gray-400 px-4 sm:px-6 py-2.5 font-medium text-sm sm:text-base text-white transition hover:bg-gray-500 order-3 sm:order-1"
            >
              Cancelar
            </button>

            {isEditing && canEdit() && (
              <button
                onClick={handleDeleteClick}
                className="rounded-lg bg-red-500 px-4 sm:px-6 py-2.5 font-medium text-sm sm:text-base text-white transition hover:bg-red-600 order-2"
              >
                Excluir
              </button>
            )}

            {canEdit() && (
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 sm:px-6 py-2.5 font-medium text-sm sm:text-base text-white transition hover:bg-primary/90 order-1 sm:order-3"
              >
                {isEditing ? "Atualizar" : "Criar"}
              </button>
            )}
          </div>

          {/* Aviso se não pode editar */}
          {isEditing && !canEdit() && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              Este agendamento não pode ser editado no momento.
            </div>
          )}
        </div>
      </Modal>

      {/* Confirm Modal para Exclusão */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Excluir Agendamento"
        message="Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
