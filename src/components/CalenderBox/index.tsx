"use client";
import { useState, useEffect } from "react";
import InputGroup from "../FormElements/InputGroup";

interface Event {
  id: number;
  date: Date;
  title: string;
  description?: string;
  phone?: string;
}

type ViewMode = "month" | "week" | "day";

interface CalendarBoxProps {
  onWhatsAppClick?: (handler: () => void) => void;
}


export default function CalendarBox({ onWhatsAppClick }: CalendarBoxProps = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [events, setEvents] = useState<Event[]>([
    { id: 1, date: new Date(2026, 0, 15), title: "Consulta Médica" },
    { id: 2, date: new Date(2026, 0, 25), title: "Reunião" },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const weekDaysFull = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((ev) => isSameDay(ev.date, date));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setTitle("");
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedDate || !title.trim()) return;
    if (editingEvent) {
      setEvents(
        events.map((ev) =>
          ev.id === editingEvent.id ? { ...ev, title, date: selectedDate, description, phone } : ev
        )
      );
    } else {
      setEvents([...events, { id: Date.now(), date: selectedDate, title, description, phone }]);
    }
    setModalOpen(false);
  };

  const handleEdit = (ev: Event) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDescription(ev.description || "");
    setPhone(ev.phone || "");
    setSelectedDate(ev.date);
    setModalOpen(true);
  };

  const handleDelete = (ev: Event) => {
    setEvents(events.filter((e) => e.id !== ev.id));
    setModalOpen(false);
  };

  const handleWhatsAppSend = () => {
    if (!phone || !title.trim()) {
      alert("Por favor, preencha o telefone e o título do agendamento.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const dateStr = selectedDate?.toLocaleDateString("pt-BR") || "";
    const timeStr = selectedDate?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) || "";
    
    let message = `Olá! Gostaria de agendar:\n\n`;
    message += `📅 *${title}*\n`;
    message += `📆 Data: ${dateStr}\n`;
    message += `🕐 Horário: ${timeStr}\n`;
    if (description) {
      message += `📝 Descrição: ${description}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setWhatsappModalOpen(false);
  };

  const handleWhatsAppClick = () => {
    setSelectedDate(new Date());
    setTitle("");
    setDescription("");
    setPhone("");
    setEditingEvent(null);
    setWhatsappModalOpen(true);
  };

  useEffect(() => {
    if (onWhatsAppClick) {
      onWhatsAppClick(handleWhatsAppClick);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Preencher dias vazios antes do primeiro dia
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Preencher os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatDateHeader = () => {
    if (viewMode === "month") {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === "week") {
      const weekDays = getWeekDays();
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.getDate()} - ${end.getDate()} de ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    } else {
      return `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  const renderMonthView = () => {
    const days = getMonthDays();
    const rows: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 rounded-t-[10px] bg-primary text-white">
          {weekDaysFull.map((day, i) => (
            <div
              key={i}
              className={`flex h-15 items-center justify-center p-1 text-xs font-medium sm:text-base ${
                i === 0 ? "rounded-tl-[10px]" : ""
              } ${i === 6 ? "rounded-tr-[10px]" : ""}`}
            >
              <span className="hidden lg:block">{day}</span>
              <span className="block lg:hidden">{day.slice(0, 3)}</span>
            </div>
          ))}
        </div>
        <div>
          {rows.map((week, idx) => (
            <div key={idx} className="grid grid-cols-7">
              {week.map((date, i) => {
                if (!date) {
                  return <div key={`empty-${i}`} className="h-20 border border-stroke dark:border-dark-3 md:h-25 xl:h-31" />;
                }
                const dayEvents = getEventsForDate(date);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={i}
                    onClick={() => handleDayClick(date)}
                    className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2 md:h-25 md:p-4 xl:h-31"
                  >
                    <span
                      className={`font-medium ${
                        isToday
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white"
                          : "text-dark dark:text-white"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(ev);
                          }}
                          className="truncate rounded bg-primary px-2 py-0.5 text-xs text-white hover:bg-primary/80"
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          +{dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 rounded-t-[10px] bg-primary text-white">
          {days.map((date, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center p-2 text-xs font-medium sm:text-base ${
                i === 0 ? "rounded-tl-[10px]" : ""
              } ${i === 6 ? "rounded-tr-[10px]" : ""}`}
            >
              <span>{weekDays[i]}</span>
              <span className="text-sm">{date.getDate()}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((date, i) => {
            const dayEvents = getEventsForDate(date);
            const isToday = isSameDay(date, new Date());

            return (
              <div
                key={i}
                onClick={() => handleDayClick(date)}
                className={`ease relative min-h-[200px] cursor-pointer border border-stroke p-4 transition duration-500 hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2 ${
                  isToday ? "bg-primary/5" : ""
                }`}
              >
                <div className="space-y-2">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(ev);
                      }}
                      className="rounded bg-primary px-3 py-2 text-sm text-white hover:bg-primary/80"
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="w-full rounded-[10px] p-6">
        <div className="mb-4 text-xl font-bold text-dark dark:text-white">
          {weekDaysFull[currentDate.getDay()]}
        </div>
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Nenhum evento para este dia</p>
          ) : (
            dayEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => handleEdit(ev)}
                className="cursor-pointer rounded-lg border border-stroke bg-white p-4 shadow-sm transition hover:shadow-md dark:border-dark-3 dark:bg-gray-dark"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-dark dark:text-white">{ev.title}</span>
                  <span className="rounded bg-primary px-3 py-1 text-sm text-white">
                    Editar
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => handleDayClick(currentDate)}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary/90"
        >
          + Adicionar Evento
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Barra de Navegação e Controles */}
      <div className="mb-4 flex flex-col gap-4 rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card sm:flex-row sm:items-center sm:justify-between">
        {/* Navegação */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-lg border border-stroke px-4 py-2 font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Hoje
          </button>
          <button
            onClick={navigatePrev}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            ‹
          </button>
          <button
            onClick={navigateNext}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            ›
          </button>
          <h2 className="ml-2 text-lg font-bold text-dark dark:text-white">
            {formatDateHeader()}
          </h2>
        </div>

        {/* Seletor de Visualização */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("month")}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              viewMode === "month"
                ? "bg-primary text-white"
                : "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              viewMode === "week"
                ? "bg-primary text-white"
                : "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              viewMode === "day"
                ? "bg-primary text-white"
                : "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            }`}
          >
            Dia
          </button>
        </div>
      </div>

      {/* Calendário */}
      <div className="w-full max-w-full overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {viewMode === "month" && renderMonthView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "day" && renderDayView()}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-150 rounded-lg bg-white p-5 shadow-xl dark:bg-gray-dark">
            <h2 className="mb-4 text-2xl font-medium text-dark dark:text-white">
              {editingEvent
                ? "Editar evento"
                : `Adicionar evento - ${selectedDate?.getDate()} de ${selectedDate ? monthNames[selectedDate.getMonth()] : ""}`}
            </h2>

            <InputGroup
              required
              label="Evento"
              placeholder="Qual evento?"
              type="text"
              value={title}
              handleChange={(e) => setTitle(e.target.value)}
            />

            <div className="mt-4">
              <InputGroup
                label="Descrição"
                placeholder="Detalhes do evento (opcional)"
                type="text"
                value={description}
                handleChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <InputGroup
                label="Telefone"
                placeholder="(00) 00000-0000"
                type="tel"
                value={phone}
                handleChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-500 lg:w-auto"
              >
                Fechar
              </button>
              {editingEvent && (
                <button
                  onClick={() => handleDelete(editingEvent)}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 lg:w-auto"
                >
                  Excluir
                </button>
              )}
              <button
                onClick={handleSave}
                className="w-full rounded-lg bg-primary px-4 py-2 text-white lg:w-auto"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal WhatsApp */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div className="w-full max-w-150 rounded-lg bg-white p-5 shadow-xl dark:bg-gray-dark">
            <h2 className="mb-4 text-2xl font-medium text-dark dark:text-white">
              Agendar via WhatsApp
            </h2>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                Serviço <span className="text-red">*</span>
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              >
                <option value="">Selecione um serviço</option>
                <option value="Consulta">Consulta</option>
                <option value="Exame">Exame</option>
                <option value="Retorno">Retorno</option>
                <option value="Avaliação">Avaliação</option>
                <option value="Terapia">Terapia</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="mt-4">
              <InputGroup
                label="Data e Hora"
                type="datetime-local"
                value={
                  selectedDate
                    ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                handleChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>

            <div className="mt-4">
              <InputGroup
                label="Descrição"
                placeholder="Detalhes do agendamento (opcional)"
                type="text"
                value={description}
                handleChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <InputGroup
                required
                label="Telefone (WhatsApp)"
                placeholder="(00) 00000-0000"
                type="tel"
                value={phone}
                handleChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="w-full rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-500 lg:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={handleWhatsAppSend}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 lg:w-auto"
              >
                Enviar WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

