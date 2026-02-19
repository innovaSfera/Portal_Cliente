"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export function OverviewCardsCarousel({ views, profit, products, users }: any) {
  return (
    <>
      {/* Swiper para mobile */}
      <div className="block xl:hidden">
        <Swiper spaceBetween={16} slidesPerView={1.15} grabCursor={true}>
          <SwiperSlide>
            <OverviewCard label={views.label || "Total de Atendimentos"} data={views} Icon={icons.Views} />
          </SwiperSlide>

          <SwiperSlide>
            <OverviewCard
              label={profit.label || "Consultas Realizadas"}
              data={profit}
              Icon={icons.Profit}
            />
          </SwiperSlide>

          <SwiperSlide>
            <OverviewCard
              label={products.label || "Próximas Consultas"}
              data={products}
              Icon={icons.Product}
            />
          </SwiperSlide>

          <SwiperSlide>
            <OverviewCard label={users.label || "Atendimentos (30 dias)"} data={users} Icon={icons.Users} />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Grid para desktop */}
      <div className="hidden gap-4 sm:grid-cols-2 xl:grid xl:grid-cols-4">
        <OverviewCard label={views.label || "Total de Atendimentos"} data={views} Icon={icons.Views} />
        <OverviewCard label={profit.label || "Consultas Realizadas"} data={profit} Icon={icons.Profit} />
        <OverviewCard
          label={products.label || "Próximas Consultas"}
          data={products}
          Icon={icons.Product}
        />
        <OverviewCard label={users.label || "Atendimentos (30 dias)"} data={users} Icon={icons.Users} />
      </div>
    </>
  );
}
