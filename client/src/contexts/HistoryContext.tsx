import React, { createContext, useContext, useState, useEffect } from "react";

export interface ConsultaHistorico {
  id: string;
  cnpj: string;
  razaoSocial: string;
  riskScore: number;
  riskLevel: "BAIXO" | "MÉDIO" | "ALTO";
  dataConsulta: string;
  municipio: string;
  uf: string;
}

interface HistoryContextType {
  historico: ConsultaHistorico[];
  adicionarConsulta: (consulta: ConsultaHistorico) => void;
  limparHistorico: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [historico, setHistorico] = useState<ConsultaHistorico[]>([]);

  // Carregar histórico do localStorage ao montar
  useEffect(() => {
    const historicoSalvo = localStorage.getItem("crediguard_historico");
    if (historicoSalvo) {
      try {
        setHistorico(JSON.parse(historicoSalvo));
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    }
  }, []);

  // Salvar histórico no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("crediguard_historico", JSON.stringify(historico));
  }, [historico]);

  const adicionarConsulta = (consulta: ConsultaHistorico) => {
    setHistorico((prev) => [consulta, ...prev]);
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem("crediguard_historico");
  };

  return (
    <HistoryContext.Provider value={{ historico, adicionarConsulta, limparHistorico }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory deve ser usado dentro de HistoryProvider");
  }
  return context;
}
