import { getMeuHistorico } from "@/services/api/cliente.service";
import { getMinhasConsultas } from "@/services/api/cliente.service";

export async function getOverviewData() {
  try {
    const [historico, consultas] = await Promise.all([
      getMeuHistorico(),
      getMinhasConsultas()
    ]);
    
    // Calcular estatísticas do histórico (historico é array de AtendimentoHistoricoResponse)
    const totalAtendimentos = historico.length;
    const atendimentosRecentes = historico.filter(
      (a) => a.dataConclusaoServico && new Date(a.dataConclusaoServico) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    // Status: 0=AConfirmar, 1=ConfirmadoPeloPaciente, 2=CanceladoPeloPaciente, 
    //         3=ConfirmadoPeloProfissional, 4=CanceladoPeloProfissional, 5=Concluida, 6=Faltou
    const consultasRealizadas = consultas.filter(
      (c) => c.status === 5 // Concluída
    ).length;
    
    const proximasConsultas = consultas.filter(
      (c) => (c.status === 0 || c.status === 1 || c.status === 3) && new Date(c.dataInicio) > new Date()
    ).length;

    return {
      views: {
        value: totalAtendimentos,
        growthRate: atendimentosRecentes > 0 ? 0.43 : 0,
      },
      profit: {
        value: consultasRealizadas,
        growthRate: consultasRealizadas > 0 ? 4.35 : 0,
      },
      products: {
        value: proximasConsultas,
        growthRate: proximasConsultas > 0 ? 2.59 : 0,
      },
      users: {
        value: atendimentosRecentes,
        growthRate: atendimentosRecentes > 0 ? -0.95 : 0,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados de overview:", error);
    
    // Retornar dados vazios em caso de erro
    return {
      views: {
        value: 0,
        growthRate: 0,
      },
      profit: {
        value: 0,
        growthRate: 0,
      },
      products: {
        value: 0,
        growthRate: 0,
      },
      users: {
        value: 0,
        growthRate: 0,
      },
    };
  }
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}