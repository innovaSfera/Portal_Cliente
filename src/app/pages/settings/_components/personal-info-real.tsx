"use client";
import {
  CallIcon,
  EmailIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { getMeuPerfil, atualizarPerfil } from "@/services/api/cliente.service";
import { useEffect, useState } from "react";

export function PersonalInfoForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [data, setData] = useState({
    nome: "",
    email: "",
    nrTelefone: "",
    cpf: "",
    rua: "",
    numero: "",
    cep: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfil = await getMeuPerfil();
        setData({
          nome: perfil.nome || "",
          email: perfil.email || "",
          nrTelefone: perfil.nrTelefone || "",
          cpf: perfil.cpf || "",
          rua: perfil.rua || "",
          numero: perfil.numero || "",
          cep: perfil.cep || "",
          complemento: perfil.complemento || "",
          bairro: perfil.bairro || "",
          cidade: perfil.cidade || "",
          estado: perfil.estado || "",
        });
      } catch (err: any) {
        setError(err.message || "Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

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

  // Máscara de telefone ((XX) XXXXX-XXXX)
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
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
    } else if (name === "nrTelefone") {
      setData({
        ...data,
        [name]: formatTelefone(value),
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
    setSuccess(false);
    setSaving(true);

    try {
      // Remove máscaras
      const telefoneLimpo = data.nrTelefone.replace(/\D/g, "");
      
      await atualizarPerfil({
        nome: data.nome,
        email: data.email,
        nrTelefone: telefoneLimpo,
        rua: data.rua,
        numero: data.numero,
        cep: data.cep,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
      });
      
      setSuccess(true);
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ShowcaseSection title="Informações Pessoais" className="!p-7">
        <div className="flex items-center justify-center py-8">
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        </div>
      </ShowcaseSection>
    );
  }

  return (
    <ShowcaseSection title="Informações Pessoais" className="!p-7">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Perfil atualizado com sucesso!
          </div>
        )}

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="nome"
            label="Nome Completo"
            placeholder="Seu nome completo"
            value={data.nome}
            handleChange={handleChange}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="nrTelefone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={data.nrTelefone}
            handleChange={handleChange}
            icon={<CallIcon />}
            iconPosition="left"
            height="sm"
            maxLength={15}
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="email"
          name="email"
          label="Email"
          placeholder="seu@email.com"
          value={data.email}
          handleChange={handleChange}
          icon={<EmailIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="text"
          name="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          value={data.cpf}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
          disabled
          maxLength={14}
        />

        <InputGroup
          className="mb-5.5"
          type="text"
          name="rua"
          label="Rua"
          placeholder="Nome da rua"
          value={data.rua}
          handleChange={handleChange}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
        />

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
            onClick={() => window.location.reload()}
          >
            Cancelar
          </button>

          <button
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={saving}
          >
            {saving && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
            )}
            <span>{saving ? "Salvando..." : "Salvar"}</span>
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
