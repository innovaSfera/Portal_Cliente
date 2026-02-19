"use client";
import { useEffect, useState } from "react";
import { getMinhasConsultas, confirmarConsulta, cancelarConsulta } from "@/services/api/cliente.service";
import { MinhasConsultasResponse, ConsultaResponse } from "@/services/api/types";

export default function ConsultasLista() {
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const response: MinhasConsultasResponse = await getMinhasConsultas();
      setConsultas(response);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar consultas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleConfirmar = async (id: string) => {
    try {
      setActionLoading(id);
      await confirmarConsulta(id);
      
      // Atualizar a lista localmente (1 = Confirmada pelo Paciente)
      setConsultas(
        consultas.map((c) =>
          c.id === id ? { ...c, status: 1 } : c
        )
      );
      
    } catch (err: any) {
      alert(err.message || "Erro ao confirmar consulta");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelar = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta consulta?")) return;
    
    try {
      setActionLoading(id);
      await cancelarConsulta(id);
      
      // Atualizar a lista localmente (2 = Cancelada pelo Paciente)
      setConsultas(
        consultas.map((c) =>
          c.id === id ? { ...c, status: 2 } : c
        )
      );
      
    } catch (err: any) {
      alert(err.message || "Erro ao cancelar consulta");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: // Confirmada
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case 3: // Concluída
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case 2: // Cancelada
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case 0: // Pendente
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return "A Confirmar";
      case 1: return "Confirmada pelo Paciente";
      case 2: return "Cancelada pelo Paciente";
      case 3: return "Confirmada pelo Profissional";
      case 4: return "Cancelada pelo Profissional";
      case 5: return "Concluída";
      case 6: return "Faltou";
      default: return "Status desconhecido";
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center justify-center py-8">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (consultas.length === 0) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
          Minhas Consultas
        </h2>
        <p className="text-body text-dark-5 dark:text-dark-6">
          Você não possui consultas agendadas no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
      <h2 className="mb-6 text-xl font-semibold text-dark dark:text-white">
        Minhas Consultas
      </h2>

      <div className="space-y-4">
        {consultas.map((consulta) => (
          <div
            key={consulta.id}
            className="rounded-lg border border-stroke p-4 dark:border-dark-3"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="mb-1 text-lg font-medium text-dark dark:text-white">
                  {consulta.funcionario?.nome || "Profissional a definir"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {consulta.titulo || consulta.descricao || "Consulta agendada"}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                  consulta.status
                )}`}
              >
                {getStatusLabel(consulta.status)}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Data</p>
                <p className="font-medium text-dark dark:text-white">
                  {formatDate(consulta.dataInicio)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Horário</p>
                <p className="font-medium text-dark dark:text-white">
                  {formatTime(consulta.dataInicio)} - {formatTime(consulta.dataFim)}
                </p>
              </div>
            </div>

            {consulta.observacao && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Observações</p>
                <p className="text-sm text-dark dark:text-white">
                  {consulta.observacao}
                </p>
              </div>
            )}

            {consulta.status === 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirmar(consulta.id)}
                  disabled={actionLoading === consulta.id}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading === consulta.id ? "Confirmando..." : "Confirmar"}
                </button>
                <button
                  onClick={() => handleCancelar(consulta.id)}
                  disabled={actionLoading === consulta.id}
                  className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {actionLoading === consulta.id ? "Cancelando..." : "Cancelar"}
                </button>
              </div>
            )}

            {consulta.status === 1 && (
              <button
                onClick={() => handleCancelar(consulta.id)}
                disabled={actionLoading === consulta.id}
                className="w-full rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {actionLoading === consulta.id ? "Cancelando..." : "Cancelar Consulta"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
