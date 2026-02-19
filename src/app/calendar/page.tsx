"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import ConsultasLista from "@/components/ConsultasLista";
import { Suspense, useState } from "react";
import { OverviewMenuGroup } from "../(home)/_components/overview-cards/index-menu";
import { OverviewCardsSkeleton } from "../(home)/_components/overview-cards/skeleton";
import MenuMobile from "@/components/MenuMobile";

const CalendarPage = () => {
  const [whatsappHandler, setWhatsappHandler] = useState<(() => void) | null>(null);

  return (
    <div className="pb-24">
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewMenuGroup />
      </Suspense>

      <Breadcrumb 
        pageName="Agenda" 
        onButtonClick={() => whatsappHandler?.()} 
      />

      <div className="mb-8">
        <ConsultasLista />
      </div>

      <CalendarBox onWhatsAppClick={(handler) => setWhatsappHandler(() => handler)} />

      <MenuMobile />
    </div>
  );
};

export default CalendarPage;
