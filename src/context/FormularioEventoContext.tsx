"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface FormData {
  [key: string]: string | number | boolean;
}

interface MaterialSelecionado {
  categoria: number;
  nome: string;
  quantidade: number;
}

type SelectedDates = Record<string, Date | undefined>;

interface FormularioEventoContextType {
  idCliente: number | null;
  setIdCliente: React.Dispatch<React.SetStateAction<number | null>>;
  idEvento: number | null;
  setIdEvento: React.Dispatch<React.SetStateAction<number | null>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectedDates: SelectedDates;
  setSelectedDates: React.Dispatch<React.SetStateAction<SelectedDates>>;
  imagens: File[];
  setImagens: React.Dispatch<React.SetStateAction<File[]>>;
  materiais: MaterialSelecionado[];
  setMateriais: React.Dispatch<React.SetStateAction<MaterialSelecionado[]>>;
  limparFormulario: () => void;
  salvarFormulario: (dados: {
    formData: FormData;
    selectedDates: SelectedDates;
    imagens?: File[];
    materiais?: MaterialSelecionado[];
  }) => void;
}

const FormularioEventoContext = createContext<FormularioEventoContextType | undefined>(undefined);

export const FormularioEventoProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({});
  const [imagens, setImagens] = useState<File[]>([]);
  const [materiais, setMateriais] = useState<MaterialSelecionado[]>([]);
  
  const [idCliente, setIdCliente] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("idCliente");
      return stored ? Number(stored) : null;
    }
    return null;
  });

  const [idEvento, setIdEvento] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("idEvento");
      return stored ? Number(stored) : null;
    }
    return null;
  });

  const limparFormulario = () => {
    setFormData({});
    setSelectedDates({});
    setImagens([]);
    setMateriais([]);
    setIdCliente(null);
    setIdEvento(null);
    localStorage.removeItem("idCliente");
    localStorage.removeItem("idEvento");
  };

  const salvarFormulario = ({
    formData,
    selectedDates,
    imagens = [],
    materiais = [],
  }: {
    formData: FormData;
    selectedDates: SelectedDates;
    imagens?: File[];
    materiais?: MaterialSelecionado[];
  }) => {
    setFormData(formData);
    setSelectedDates(selectedDates);
    setImagens(imagens);
    setMateriais(materiais);

    const idFromFormCliente = formData.idCliente;
    if (typeof idFromFormCliente === "number") {
      setIdCliente(idFromFormCliente);
      localStorage.setItem("idCliente", String(idFromFormCliente));
    }

    const idFromFormEvento = formData.idEvento;
    if (typeof idFromFormEvento === "number") {
      setIdEvento(idFromFormEvento);
      localStorage.setItem("idEvento", String(idFromFormEvento));
    }
  };

  return (
    <FormularioEventoContext.Provider
      value={{
        idCliente,
        setIdCliente,
        idEvento,
        setIdEvento,
        formData,
        setFormData,
        selectedDates,
        setSelectedDates,
        imagens,
        setImagens,
        materiais,
        setMateriais,
        limparFormulario,
        salvarFormulario,
      }}
    >
      {children}
    </FormularioEventoContext.Provider>
  );
};

export const useFormularioEvento = () => {
  const context = useContext(FormularioEventoContext);
  if (!context) {
    throw new Error("useFormularioEvento precisa estar dentro do FormularioEventoProvider");
  }
  return context;
};
