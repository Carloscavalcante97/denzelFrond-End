import { ReactNode } from "react";

interface IMaterial {
  quantidade?: ReactNode;
  id: number;
  Nome: string;
  dimensoes?: string;
  status:
    | "extraviado"
    | "em manutencao"
    | "em estoque"
    | "em uso"
    | "transposicao";
  categoria: number;
}
export default IMaterial;
