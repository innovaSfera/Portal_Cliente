import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCardsCarousel } from "./OverviewCardsCarousel";

export async function OverviewCardsGroup() {
  const { views, profit, products, users } = await getOverviewData();

  const formattedData = {
    views: { ...views, value: compactFormat(views.value), label: "Total de Atendimentos" },
    profit: { ...profit, value: compactFormat(profit.value), label: "Consultas Realizadas" },
    products: { ...products, value: compactFormat(products.value), label: "Próximas Consultas" },
    users: { ...users, value: compactFormat(users.value), label: "Atendimentos (30 dias)" },
  };

  return <OverviewCardsCarousel {...formattedData} />;
}
