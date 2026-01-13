"use client";
import { PasswordIcon } from "@/assets/icons";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { CpfInput } from "../FormElements/CpfInput";

export default function SigninWithPassword() {
  const { login, error: authError } = useAuth();
  const [data, setData] = useState({
    cpf: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    // Limpar erro quando usuário começar a digitar
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validações básicas
      const cleanCpf = data.cpf.replace(/\D/g, "");
      if (cleanCpf.length !== 11) {
        setError("CPF inválido. Digite os 11 dígitos.");
        setLoading(false);
        return;
      }

      if (data.password.length < 6) {
        setError("Senha deve ter no mínimo 6 caracteres.");
        setLoading(false);
        return;
      }

      // Realizar login via API
      await login(data.cpf, data.password);

      // Salvar no cookie também para o middleware
      document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // 24 horas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao realizar login.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mensagem de erro */}
      {(error || authError) && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error || authError}
        </div>
      )}

      {/* Campo CPF com máscara */}
      <div>
        <label className="mb-2.5 block text-sm font-medium text-dark dark:text-white">
          CPF
        </label>
        <CpfInput
          value={data.cpf}
          onChange={handleChange}
          name="cpf"
          disabled={loading}
          placeholder="000.000.000-00"
          className="w-full rounded-lg border border-stroke bg-transparent py-3.5 pl-4 pr-4 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-2 disabled:opacity-70 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      <InputGroup
        type="password"
        label="Senha"
        className="[&_input]:py-3.5"
        placeholder="Digite sua senha"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
        disabled={loading}
      />

      <div className="flex items-center justify-between py-1">
        <Checkbox
          label="Lembrar-me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="#"
          className="text-sm font-medium text-primary hover:underline dark:text-primary"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3.5 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
            <span>Entrando...</span>
          </>
        ) : (
          <span>Entrar</span>
        )}
      </button>
    </form>
  );
}
