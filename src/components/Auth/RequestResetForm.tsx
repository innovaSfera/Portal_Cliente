"use client";
import { EmailIcon } from "@/assets/icons";
import { solicitarResetSenha } from "@/services/api/cliente.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";

export default function RequestResetForm() {
  const router = useRouter();
  const [data, setData] = useState({
    cpf: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Máscara de CPF (XXX.XXX.XXX-XX)
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cpf") {
      setData({
        ...data,
        [name]: formatCPF(value),
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Remove máscara do CPF (manter apenas números)
      const cpfLimpo = data.cpf.replace(/\D/g, "");
      
      const response = await solicitarResetSenha(cpfLimpo, data.email);
      
      setSuccess(true);
      
      // Redirecionar após 3 segundos, passando userId na URL
      setTimeout(() => {
        const userId = response.userId || "";
        router.push(`/auth/reset-password/confirm?userId=${userId}`);
      }, 3000);
      
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao solicitar reset de senha. Tente novamente.");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <p className="font-medium">Código enviado com sucesso!</p>
          <p className="mt-2">Verifique seu email para obter o código de recuperação.</p>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Redirecionando para a próxima etapa...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <InputGroup
        type="text"
        label="CPF"
        className="[&_input]:py-3.5"
        placeholder="000.000.000-00"
        name="cpf"
        handleChange={handleChange}
        value={data.cpf}
        icon={<EmailIcon />}
        maxLength={14}
      />

      <InputGroup
        type="email"
        label="Email"
        className="[&_input]:py-3.5"
        placeholder="seu@email.com"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              <span>Enviando...</span>
            </>
          ) : (
            <span>Enviar Código</span>
          )}
        </button>

        <Link
          href="/auth/sign-in"
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-6 py-3.5 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Voltar ao Login
        </Link>
      </div>
    </form>
  );
}
