"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CloseIcon from "/public/Fechar-Modal.svg";
import SearchIcon from "/public/search.svg";
import BoxIcon from "/public/Material.svg";
import EstruturaIcon from "/public/estrutura.svg";
import SaneamentoIcon from "/public/sanitario.svg";
import IluminacaoIcon from "/public/iluminacao.svg";
import geradorIcon from "/public/geradorIcon.svg";
import climatizacaoIcon from "/public/climatizacaoIcon.svg";
import Solicitacao from "/public/Solicitacao.svg";
import { ChevronDown, ChevronUp } from "lucide-react";
import Material from "../@Types/Material";

interface Props {
  onClose: () => void;
  onSelecionar: (materiais: { nome: string; quantidade: number; categoria: number }[]) => void;
}

const categorias = [
  { nome: "Filtrar", valor: 0 },
  { nome: "Iluminação", valor: 1 },
  { nome: "Estrutura", valor: 2 },
  { nome: "Gerador", valor: 3 },
  { nome: "Climatização", valor: 4 },
  { nome: "Saneamento", valor: 5 },
];

export default function ModalAdicionarMaterial({ onClose, onSelecionar }: Props) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(0);
  const [mostrarSelecionados, setMostrarSelecionados] = useState(true);
  const [resultadosBusca, setResultadosBusca] = useState<Material[] | null>(null);

  const [selecionados, setSelecionados] = useState<Record<string, { nome: string; quantidade: number; categoria: number; ids: number[] }>>({});
  const [quantidadesPendentes, setQuantidadesPendentes] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("https://denzel-backend.onrender.com/api/materiais/Listar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMateriais(data);
          setResultadosBusca(null);
        } else {
          setMateriais([]);
        }
      })
      .catch((err) => console.error("Erro ao buscar materiais:", err));
  }, []);

  const getCategoriaIcon = (categoria: number) => {
    switch (categoria) {
      case 1: return IluminacaoIcon;
      case 2: return EstruturaIcon;
      case 3: return geradorIcon;
      case 4: return climatizacaoIcon;
      case 5: return SaneamentoIcon;
      default: return BoxIcon;
    }
  };

  const agrupados = (materiaisParaAgrupar: Material[]) => {
    const mapa = new Map<string, { quantidade: number; categoria: number; ids: number[] }>();
    for (const mat of materiaisParaAgrupar) {
      const nome = String(mat.Nome);
      const id = Number(mat.id);
      if (isNaN(id)) continue;
      if (!mapa.has(nome)) {
        mapa.set(nome, { quantidade: 1, categoria: mat.categoria, ids: [id] });
      } else {
        const atual = mapa.get(nome)!;
        mapa.set(nome, {
          quantidade: atual.quantidade + 1,
          categoria: mat.categoria,
          ids: [...atual.ids, id],
        });
      }
    }
    return Array.from(mapa.entries());
  };

  const materiaisParaExibir = agrupados(
    (resultadosBusca ?? materiais).filter(
      (m) => m.id !== undefined && (categoriaFiltro === 0 || m.categoria === categoriaFiltro)
    )
  );

  const selecionadosFormatados = Object.values(selecionados);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#100D1E] text-white rounded-lg p-8 w-[800px] h-[620px] shadow-lg relative flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4">
          <Image src={CloseIcon} alt="Fechar" width={24} height={24} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Image src={Solicitacao} alt="Solicitação" width={307} height={30} />
        </div>

        <div className="mb-4">
          <button onClick={() => setMostrarSelecionados(!mostrarSelecionados)} className="flex items-center gap-2 w-full bg-[#1D1933] px-4 py-2 rounded">
            <span className="font-bold">Materiais Selecionados ({selecionadosFormatados.length})</span>
            {mostrarSelecionados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {mostrarSelecionados && (
            <div className="mt-2 max-h-[120px] overflow-y-auto space-y-2">
              {selecionadosFormatados.map((item) => (
                <div key={item.nome} className="bg-[#1D1933] p-2 rounded mb-2 flex items-center gap-2">
                  <Image src={getCategoriaIcon(item.categoria)} alt="Icone" width={18} height={18} />
                  <span className="flex-1 font-semibold">{item.nome}</span>
                  <span className="text-sm text-gray-400">Qtd: {item.quantidade}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky top-0 z-10 bg-[#100D1E] pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#1D1933] px-4 py-2 rounded w-full">
              <Image src={SearchIcon} alt="Buscar" width={20} height={20} />
              <input
                type="text"
                placeholder="Buscar Materiais"
                value={busca}
                onChange={(e) => {
                  const termo = e.target.value;
                  setBusca(termo);
                  if (termo.trim() === "") {
                    setResultadosBusca(null);
                  } else {
                    const filtrados = materiais.filter(
                      (m) =>
                        String(m.Nome).toLowerCase().includes(termo.toLowerCase()) &&
                        (categoriaFiltro === 0 || m.categoria === categoriaFiltro)
                    );
                    setResultadosBusca(filtrados);
                  }
                }}
                className="bg-transparent w-full ml-2 text-white outline-none"
              />
            </div>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(Number(e.target.value))}
              className="px-4 py-2 rounded border border-white bg-[#1D1933] text-white"
            >
              {categorias.map((cat) => (
                <option key={cat.valor} value={cat.valor}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 mt-2">
          {materiaisParaExibir.map(([nome, info]) => {
            const checked = nome in selecionados || nome in quantidadesPendentes;
            return (
              <div key={nome} className="flex items-center gap-2 mb-3 px-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setQuantidadesPendentes((prev) => ({ ...prev, [nome]: 1 }));
                    } else {
                      const copiaSel = { ...selecionados };
                      const copiaPend = { ...quantidadesPendentes };
                      delete copiaSel[nome];
                      delete copiaPend[nome];
                      setSelecionados(copiaSel);
                      setQuantidadesPendentes(copiaPend);
                    }
                  }}
                />
                <Image src={getCategoriaIcon(info.categoria)} alt="Categoria" width={18} height={18} />
                <span className="flex-1">{`${nome} (${info.quantidade})`}</span>

                {checked && (
                  <input
                    type="number"
                    min={1}
                    value={quantidadesPendentes[nome] ?? selecionados[nome]?.quantidade ?? 1}
                    onChange={(e) =>
                      setQuantidadesPendentes((prev) => ({
                        ...prev,
                        [nome]: parseInt(e.target.value),
                      }))
                    }
                    onBlur={() => {
                      const quantidade = quantidadesPendentes[nome];
                      if (quantidade >= 1) {
                        setSelecionados((prev) => ({
                          ...prev,
                          [nome]: {
                            nome,
                            quantidade,
                            categoria: info.categoria,
                            ids: info.ids,
                          },
                        }));
                        const novaPendente = { ...quantidadesPendentes };
                        delete novaPendente[nome];
                        setQuantidadesPendentes(novaPendente);
                      }
                    }}
                    className="w-[80px] h-[32px] bg-[#1D1933] p-1 rounded border border-white text-white"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-[#292343]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 transition-colors hover:text-[#100D1E]"
          >
            ◀ Cancelar
          </button>
          <button
            onClick={() => {
              onSelecionar(
                Object.values(selecionados).map(({ nome, quantidade, categoria }) => ({
                  nome,
                  quantidade,
                  categoria,
                }))
              );
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 transition-colors hover:text-[#100D1E]"
          >
            Concluir ▶
          </button>
        </div>
      </div>
    </div>
  );
}
