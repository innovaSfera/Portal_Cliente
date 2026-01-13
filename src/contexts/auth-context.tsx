"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { authService, customerService } from "@/services";
import { CustomerResponseDto } from "@/types/dto/response/customer-response.dto";

type AuthContextType = {
  isAuthenticated: boolean;
  user: CustomerResponseDto | null;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CustomerResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        // Buscar dados do usuário se estiver autenticado
        const cpf = authService.getCurrentUserCpf();
        if (cpf) {
          try {
            const customerData = await customerService.getCustomerByCpf(cpf);
            setUser(customerData);
          } catch (err) {
            console.error("Erro ao carregar dados do usuário:", err);
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (cpf: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Realiza login na API
      const loginResponse = await authService.login(cpf, password);

      if (loginResponse.authenticated) {
        // Busca dados completos do cliente
        const customerData = await customerService.getCustomerByCpf(cpf);

        if (customerData) {
          setUser(customerData);
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");

          // Redirecionar para a agenda (calendário)
          window.location.href = "/calendar";
        } else {
          throw new Error("Cliente não encontrado no sistema.");
        }
      } else {
        throw new Error(loginResponse.message || "Falha na autenticação.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao realizar login.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    router.push("/auth/sign-in");
  };

  const refreshUser = async () => {
    const cpf = authService.getCurrentUserCpf();
    if (cpf) {
      try {
        const customerData = await customerService.getCustomerByCpf(cpf);
        setUser(customerData);
      } catch (err) {
        console.error("Erro ao atualizar dados do usuário:", err);
      }
    }
  };

  if (isLoading) {
    return null; // ou um loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        error,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
