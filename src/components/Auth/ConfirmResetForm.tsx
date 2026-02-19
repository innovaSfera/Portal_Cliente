"use client";
import { PasswordIcon } from "@/assets/icons";
import { resetarSenha } from "@/services/api/cliente.service";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";

export default function ConfirmResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  
  const [data, setData] = useState({
    token: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validação local
    if (data.novaSenha !== data.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (data.novaSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!data.token) {
      setError("Por favor, insira o código recebido por email");
      return;
    }

    if (!userId) {
      setError("Sessão inválida. Por favor, solicite um novo reset de senha.");
      return;
    }

    setLoading(true);

    try {
      await resetarSenha({ 
        userId: userId, 
        resetToken: data.token, 
        novaSenha: data.novaSenha 
      });
      
      setSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);
      
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao resetar senha. Verifique o código e tente novamente.");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <p className="font-medium">Senha alterada com sucesso!</p>
          <p className="mt-2">Você já pode fazer login com sua nova senha.</p>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Redirecionando para o login...
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

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
        <p>Verifique seu email e insira o código de 6 dígitos recebido.</p>
      </div>

      <InputGroup
        type="text"
        label="Código de Verificação"
        className="[&_input]:py-3.5"
        placeholder="000000"
        name="token"
        handleChange={handleChange}
        value={data.token}
        maxLength={6}
      />

      <InputGroup
        type="password"
        label="Nova Senha"
        className="[&_input]:py-3.5"
        placeholder="Digite sua nova senha"
        name="novaSenha"
        handleChange={handleChange}
        value={data.novaSenha}
        icon={<PasswordIcon />}
      />

      <InputGroup
        type="password"
        label="Confirmar Nova Senha"
        className="[&_input]:py-3.5"
        placeholder="Confirme sua nova senha"
        name="confirmarSenha"
        handleChange={handleChange}
        value={data.confirmarSenha}
        icon={<PasswordIcon />}
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
              <span>Alterando...</span>
            </>
          ) : (
            <span>Alterar Senha</span>
          )}
        </button>

        <Link
          href="/auth/reset-password"
          className="flex w-full items-center justify-center text-sm font-medium text-primary hover:underline dark:text-primary"
        >
          Não recebeu o código? Solicitar novamente
        </Link>
      </div>
    </form>
  );
}
