"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Quantidade from "/public/quantidade.svg";
import extraviadoIcon from "/public/Extraviado.svg";
import manutencaoIcon from "/public/EmManutencao.svg";
import emUsoIcon from "/public/Em-Uso.svg";
import emEstoqueIcon from "/public/Em-Estoque.svg";
import avariadoIcon from "/public/Avariado.svg";
import iconExtraviado from "/public/extraviado-icon.svg";
import iconManutencao from "/public/manutencaoIcon.svg";
import iconEmUso from "/public/usoIcon.svg";
import iconEmEstoque from "/public/estoqueicon.svg";
import iconAvariado from "/public/iconAvariado.svg";
import MudarStatus from "/public/mudarStatus.svg";
import IluminacaoIcon from "/public/iluminacao.svg";
import EstruturaIcon from "/public/estrutura.svg";
import geradorIcon from "/public/geradorIcon.svg";
import climatizacaoIcon from "/public/climatizacaoIcon.svg";
import SaneamentoIcon from "/public/sanitario.svg";
import BoxIcon from "/public/Material.svg";
import ModalMudarStatus from "../../components/ModalStatus";
import ModalDeletarMateriais from "../../components/ModalDeletarMateriais";
import SidebarMobile from "../../components/sideBarMobile";
import BuscarMaterial from "@/components/BuscarMateriais";
import deletarEstoque from "/public/deletarEstoque.svg";
import deletarEstoqueHover from "/public/deletarEstoqueHover.svg";
import MudarStatusHover from "/public/Mudar-StatusHover.svg";

interface Material {
  id: string;
  Nome: string;
  status:
    | "extraviado"
    | "em manutencao"
    | "em estoque"
    | "em uso"
    | "transposição"
    | "avariado";
  categoria: string;
}

export default function Estoque() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [categoriasAbertas, setCategoriasAbertas] = useState<
    Record<string, boolean>
  >({});
  const [materiaisAbertos, setMateriaisAbertos] = useState<
    Record<string, boolean>
  >({});
  const [selecionados, setSelecionados] = useState<Record<string, boolean>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [deletarModalAberto, setDeletarModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [hoverDeletar, setHoverDeletar] = useState(false);
  const [hoverMudarStatus, setHoverMudarStatus] = useState(false);


  const getCategoriaIcon = (categoria: string | number) => {
    const cat = String(categoria);
    switch (cat.toLowerCase()) {
      case "iluminacao":
        return IluminacaoIcon;
      case "estrutura":
        return EstruturaIcon;
      case "gerador":
        return geradorIcon;
      case "climatizacao":
        return climatizacaoIcon;
      case "sanitarios":
        return SaneamentoIcon;
      default:
        return BoxIcon;
    }
  };

  const getStatusIcon = (status: Material["status"]) => {
    switch (status) {
      case "extraviado":
        return extraviadoIcon;
      case "em manutencao":
        return manutencaoIcon;
      case "em uso":
        return emUsoIcon;
      case "em estoque":
        return emEstoqueIcon;
      case "avariado":
        return avariadoIcon;
      default:
        return null;
    }
  };

  const getStatusResumoIcon = (status: Material["status"]) => {
    switch (status) {
      case "extraviado":
        return iconExtraviado;
      case "em manutencao":
        return iconManutencao;
      case "em uso":
        return iconEmUso;
      case "em estoque":
        return iconEmEstoque;
      case "avariado":
        return iconAvariado;
      default:
        return null;
    }
  };

  const categoriasDisponiveis = [
    { nome: "Estrutura", valor: "estrutura" },
    { nome: "Iluminação", valor: "iluminacao" },
    { nome: "Climatização", valor: "climatizacao" },
    { nome: "Sanitários", valor: "sanitarios" },
    { nome: "Geradores", valor: "gerador" },
  ];

  useEffect(() => {
    fetchMateriais();
  }, []);
  async function fetchMateriais() {
    try {
      const response = await fetch(
        "https://denzel-backend.onrender.com/api/materiais/Listar",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar materiais");
      const data = await response.json();

      const materiaisComId: Material[] = data
        .filter(
          (item: {
            id?: string;
            Nome: string;
            status: string;
            categoria: string;
          }) => item.id !== undefined
        )
        .map(
          (item: {
            id: string | number;
            Nome: string;
            status: Material["status"];
            categoria: string;
          }) => ({
            id: item.id.toString(),
            Nome: item.Nome,
            status: item.status,
            categoria: item.categoria,
          })
        );

      setMateriais(materiaisComId);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
    }
  }

  const materiaisFiltrados = materiais.filter((mat) =>
    mat.Nome.toLowerCase().includes(busca.toLowerCase())
  );

  const agrupado = materiaisFiltrados.reduce(
    (acc: Record<string, Record<string, Material[]>>, mat) => {
      if (!acc[mat.categoria]) acc[mat.categoria] = {};
      if (!acc[mat.categoria][mat.Nome]) acc[mat.categoria][mat.Nome] = [];
      acc[mat.categoria][mat.Nome].push(mat);
      return acc;
    },
    {}
  );

  const toggleSelecionarTodos = (nome: string, itens: Material[]) => {
    const todosSelecionados = itens.every((mat) => selecionados[mat.id]);
    const novos = { ...selecionados };
    itens.forEach((mat) => {
      novos[mat.id] = !todosSelecionados;
    });
    setSelecionados(novos);
  };

  const idsSelecionados = Object.keys(selecionados).filter(
    (id) => selecionados[id]
  );
  return (
    <div className="min-h-screen bg-[#0D0D1D] text-white p-6 pb-32 relative  ">
      <SidebarMobile />
      <div className="flex items-center gap-2 mb-6 ">
        <BuscarMaterial value={busca} onChange={(value) => setBusca(value)} />


        <button className="ml-auto text-sm flex items-center gap-1 text-white">
          <SlidersHorizontal size={16} />
          Filtrar
        </button>
      </div>

      {categoriasDisponiveis.map((cat) => (
        <div key={cat.valor} className="mb-6">
          <button
            onClick={() =>
              setCategoriasAbertas((prev) => ({
                ...prev,
                [cat.valor]: !prev[cat.valor],
              }))
            }
            className="w-full flex justify-between items-center p-4 bg-[#1D1933] border border-[#292343] rounded"
          >
            <div className="flex items-center gap-2">
              <Image
                src={getCategoriaIcon(cat.valor)}
                alt="icone"
                width={24}
                height={24}
              />
              <span className="text-lg font-semibold">{cat.nome}</span>
            </div>
            {categoriasAbertas[cat.valor] ? <ChevronUp /> : <ChevronDown />}
          </button>

          {categoriasAbertas[cat.valor] && (
            <div className="mt-2 space-y-3">
              {agrupado[cat.valor] &&
                Object.entries(agrupado[cat.valor]).map(([nome, itens]) => {
                  const contagemStatus = itens.reduce((acc, m) => {
                    acc[m.status] = (acc[m.status] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                  return (
                    <div
                      key={nome}
                      className="bg-[#15112B] p-4 rounded border border-[#292343]"
                    >
                      <div  onClick={() =>
                              setMateriaisAbertos((prev) => ({
                                ...prev,
                                [nome]: !prev[nome],
                              }))
                            } className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src={getCategoriaIcon(itens[0].categoria)}
                            alt="icone"
                            width={18}
                            height={18}
                          />
                          <input
                            type="checkbox"
                            checked={itens.every((mat) => selecionados[mat.id])}
                            onChange={() => toggleSelecionarTodos(nome, itens)}
                          />
                          <button
                            className="text-left"
                          >
                            <span className="font-semibold text-base">
                              {nome}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                              <Image
                                src={Quantidade}
                                alt="quantidade"
                                width={16}
                                height={16}
                              />
                              <span>{itens.length} itens</span>
                            </div>
                            <div className="flex gap-2 mt-1">
                              {Object.entries(contagemStatus).map(
                                ([status, count]) => (
                                  <div
                                    key={status}
                                    className="flex items-center gap-1 text-xs"
                                  >
                                    {getStatusResumoIcon(
                                      status as Material["status"]
                                    ) && (
                                      <Image
                                        src={
                                          getStatusResumoIcon(
                                            status as Material["status"]
                                          )!
                                        }
                                        alt={status}
                                        width={14}
                                        height={14}
                                      />
                                    )}
                                    <span>({count})</span>
                                  </div>
                                )
                              )}
                            </div>
                          </button>
                        </div>
                        {materiaisAbertos[nome] ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </div>

                      {materiaisAbertos[nome] && (
                        <div className="mt-3 space-y-1">
                          {itens.map((mat) => (
                            <div
                              key={mat.id}
                              className="flex justify-between items-center px-2 py-1 text-sm border-t border-[#292343]"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={!!selecionados[mat.id]}
                                  onChange={() =>
                                    setSelecionados((prev) => ({
                                      ...prev,
                                      [mat.id]: !prev[mat.id],
                                    }))
                                  }
                                />
                                <span>ID {mat.id}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(mat.status) && (
                                  <Image
                                    src={getStatusIcon(mat.status)!}
                                    alt={mat.status}
                                    width={74}
                                    height={16}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ))}

      <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center gap-4 z-50">
        <button
  onMouseEnter={() => setHoverMudarStatus(true)}
  onMouseLeave={() => setHoverMudarStatus(false)}
  onClick={() => setModalAberto(true)}
  className="transition duration-300 rounded-full"
>
  <Image
    src={hoverMudarStatus ? MudarStatusHover : MudarStatus}
    alt="Mudar Status"
    width={163}
    height={40}
  />
</button>

        <button
  onMouseEnter={() => setHoverDeletar(true)}
  onMouseLeave={() => setHoverDeletar(false)}
  onClick={() => setDeletarModalAberto(true)}
  className="transition duration-300 "
>
  <Image
    src={hoverDeletar ? deletarEstoqueHover : deletarEstoque}
    alt="Deletar Estoque"
    width={126}
    height={35}
  />
</button>

      </div>
      <ModalMudarStatus
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSucesso={() => {
          setModalAberto(false);
          setSelecionados({});
          fetchMateriais();
        }}
        idsSelecionados={idsSelecionados}
      />
      <ModalDeletarMateriais
        aberto={deletarModalAberto}
        onFechar={() => setDeletarModalAberto(false)}
        onSucesso={async () => {
          setModalAberto(false);
          setSelecionados({});
          await fetchMateriais();
        }}
        idsSelecionados={idsSelecionados}
      />
    </div>
  );
}
