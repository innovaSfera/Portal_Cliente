import { Suspense } from "react";
import { OverviewMenuGroup } from "./_components/overview-cards/index-menu";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import MenuMobile from "@/components/MenuMobile";

export default function Home() {
  return (
    <div className="pb-24">
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewMenuGroup />
      </Suspense>

      <div className="mt-8 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">
          Bem-vindo ao Portal Cliente - Instituto Barros
        </h2>
        <p className="text-body text-dark-5 dark:text-dark-6">
          Acesse seu perfil, agende consultas via WhatsApp e visualize seu histórico de atendimentos.
        </p>
      </div>

      <MenuMobile />
    </div>
  );
}
