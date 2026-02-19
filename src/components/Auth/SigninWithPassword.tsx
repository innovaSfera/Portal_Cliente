"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

export default function SigninWithPassword() {
  const { login } = useAuth();
  const [data, setData] = useState({
    cpf: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      await login(cpfLimpo, data.password);
      
      // Salvar cookie para o middleware
      document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // 24 horas
      
    } catch (err: any) {
      // Exibir erro ao usuário
      if (err.message) {
        setError(err.message);
      } else {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
      setLoading(false);
    }
  };

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
        type="password"
        label="Senha"
        className="[&_input]:py-3.5"
        placeholder="Digite sua senha"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
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
          href="/auth/reset-password"
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
