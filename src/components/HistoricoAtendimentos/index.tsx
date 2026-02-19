"use client";
import { useEffect, useState } from "react";
import { getMeuHistorico } from "@/services/api/cliente.service";
import { AtendimentoHistoricoResponse } from "@/services/api/types";

export default function HistoricoAtendimentos() {
  const [historico, setHistorico] = useState<AtendimentoHistoricoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const data = await getMeuHistorico();
        setHistorico(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar histórico");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

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

  if (!historico || historico.length === 0) {
    return (
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
          Histórico de Atendimentos
        </h2>
        <p className="text-body text-dark-5 dark:text-dark-6">
          Você ainda não possui atendimentos registrados.
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return "Em Andamento";
      case 1: return "Concluído";
      case 2: return "Cancelado";
      case 3: return "Pendente Pagamento";
      default: return "Status desconhecido";
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
      <h2 className="mb-6 text-xl font-semibold text-dark dark:text-white">
        Histórico de Atendimentos
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-gray-dark">
              <th className="px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Referência
              </th>
              <th className="px-4 py-4 font-medium text-dark dark:text-white">
                Serviços
              </th>
              <th className="px-4 py-4 font-medium text-dark dark:text-white">
                Profissional
              </th>
              <th className="px-4 py-4 font-medium text-dark dark:text-white">
                Data Conclusão
              </th>
              <th className="px-4 py-4 font-medium text-dark dark:text-white">
                Valor
              </th>
              <th className="px-4 py-4 font-medium text-dark dark:text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {historico.slice(0, 5).map((atendimento, index) => (
              <tr
                key={atendimento.id || index}
                className="border-b border-stroke dark:border-dark-3"
              >
                <td className="px-4 py-4 xl:pl-7.5">
                  <p className="text-dark dark:text-white">
                    {atendimento.referencia || "-"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-dark dark:text-white">
                    {atendimento.servicos && atendimento.servicos.length > 0
                      ? atendimento.servicos.map(s => s.nome).join(", ")
                      : "-"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-dark dark:text-white">
                    {atendimento.funcionario?.nome || "-"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-dark dark:text-white">
                    {formatDate(atendimento.dataConclusaoServico)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-dark dark:text-white">
                    {atendimento.precoDescontado || atendimento.precoOrdem
                      ? `R$ ${(atendimento.precoDescontado || atendimento.precoOrdem)?.toFixed(2)}` 
                      : "-"}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-dark dark:text-white">
                    {getStatusLabel(atendimento.status)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {historico.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando 5 de {historico.length} atendimentos
          </p>
        </div>
      )}
    </div>
  );
}
