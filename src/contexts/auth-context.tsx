"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { loginCliente, logout as apiLogout } from "@/services/api/cliente.service";
import type { ApiError } from "@/services/api/types";

type User = {
  userName: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (cpf: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar
    const authStatus = localStorage.getItem("isAuthenticated");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    if (authStatus === "true" && userName && userEmail) {
      setIsAuthenticated(true);
      setUser({ userName, email: userEmail });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (cpf: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await loginCliente(cpf, password);
      
      // Atualizar estado local
      setIsAuthenticated(true);
      setUser({
        userName: response.userName,
        email: response.email,
      });
      
      // Salvar cookie para o middleware
      document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // 24 horas
      
      return { success: true };
    } catch (error) {
      const apiError = error as ApiError;
      return { 
        success: false, 
        error: apiError.message || "Erro ao fazer login. Verifique suas credenciais." 
      };
    }
  };

  const logout = () => {
    // Limpar API service
    apiLogout();
    
    // Limpar cookie
    document.cookie = "isAuthenticated=; path=/; max-age=0";
    
    // Limpar estado local
    setIsAuthenticated(false);
    setUser(null);
    
    // Redirecionar
    router.push("/auth/sign-in");
  };

  if (isLoading) {
    return null; // ou um loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading: false }}>
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
