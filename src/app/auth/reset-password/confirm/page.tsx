import type { Metadata } from "next";
import Image from "next/image";
import institutoBarrosLogo from "@/assets/logos/instituto-barros-logo-cinza.png";
import ConfirmResetForm from "@/components/Auth/ConfirmResetForm";

export const metadata: Metadata = {
  title: "Confirmar Nova Senha",
};

export default function ConfirmResetPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Logo e Título */}
        <div className="mb-8 text-center md:mb-10">
          <div className="mb-6 flex justify-center">
            <Image
              src={institutoBarrosLogo}
              alt="Instituto Barros"
              width={160}
              height={40}
              priority
              className="object-contain"
            />
          </div>
          
          <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white sm:text-3xl">
            Criar Nova Senha
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Insira o código recebido e sua nova senha
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-dark sm:p-8">
          <ConfirmResetForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          © {new Date().getFullYear()} Instituto Barros. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
