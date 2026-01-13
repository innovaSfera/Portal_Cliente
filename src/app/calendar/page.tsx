"use client";
import "./fullcalendar.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
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

      <CalendarBox onWhatsAppClick={(handler) => setWhatsappHandler(() => handler)} />

      <MenuMobile />
    </div>
  );
};

export default CalendarPage;
