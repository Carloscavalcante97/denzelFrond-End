"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import FecharModal from "/public/Fechar-Modal.svg";
import BuscarColaborador from "./BuscarColaborador";
import LinhaModal from "/public/Linha-Modal.png";
import Recrutar from "/public/RecrutarEncarregado.svg";
import UserIcon from "/public/Profile.svg"; 
import ButtonConcluir from "./ButtonConcluir";
import ButtonCancelar from "./ButtonCancelar";

interface Colaborador {
  id: number;
  Nome: string;
}

interface BuscarColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelecionar: (colaboradoresSelecionados: { id: number; nome: string }[]) => void;
  cargo: "encarregado estrutura" | "encarregado iluminacao";
}

export default function BuscarColaboradorModal({
  isOpen,
  onClose,
  onSelecionar,
  cargo,
}: BuscarColaboradorModalProps) {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [selecionados, setSelecionados] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      buscarColaboradores();
      setSelecionados([]);
    }
  }, [isOpen, cargo]);

  const buscarColaboradores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://denzel-backend.onrender.com/api/usuarios/ListarPorCargo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro na busca de colaboradores");

      const data = await response.json();
      setColaboradores(data);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarCheckbox = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConcluirSelecao = () => {
    const colaboradoresSelecionados = colaboradores
      .filter((colab) => selecionados.includes(colab.id))
      .map((colab) => ({ id: colab.id, nome: colab.Nome }));

    onSelecionar(colaboradoresSelecionados);
    onClose();
  };

  const colaboradoresFiltrados = colaboradores.filter((colab) =>
    colab.Nome?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(
        termoBusca
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      )
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50"
    >
      <div className="relative bg-[#1c1530] text-white p-8 rounded-xl w-[600px] min-h-[500px] max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Linha Decorativa */}
        <div className="absolute top-0 left-0 w-full h-1">
          <Image
            src={LinhaModal}
            alt="Linha decorativa"
            layout="responsive"
            width={800}
            height={5}
            priority
            className="w-full"
          />
        </div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 hover:scale-110 transition-transform"
        >
          <Image
            src={FecharModal}
            className="hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded-full"
            alt="Fechar"
            width={24}
            height={24}
          />
        </button>

        {/* Título */}
        <Image src={Recrutar} className="w-[375px] h-[40px] mb-4" alt="Recrutar" />

        {/* Campo de Busca */}
        <div className="mb-6">
          <BuscarColaborador value={termoBusca} onChange={setTermoBusca} />
        </div>

        {/* Lista em Tabela */}
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : (
          <>
            {colaboradoresFiltrados.length === 0 ? (
              <p className="text-center text-gray-400">Nenhum colaborador encontrado.</p>
            ) : (
              <table className="w-full border-collapse border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-gray-300">
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-2">
                          <Image src={UserIcon} alt="Colaborador" width={12} height={12} />
                         <span className="font-bold text-white">Colaborador</span>
                        </div>
                        <div className="w-[180px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">ID</span>
                        </div>
                        <div className="w-[80px] h-[1px] bg-gray-500 mt-1" />
                      </div>
                    </th>
                    <th className="p-3 text-white font-bold">Selecionar</th>
                  </tr>
                </thead>

                <tbody>
                  {colaboradoresFiltrados.map((colab) => (
                    <tr
                      key={colab.id}
                      className=" hover:bg-[#3a2e5d] transition-colors "
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Image src={UserIcon} alt="Colaborador" width={12} height={12} />
                          <span>{colab.Nome}</span>
                        </div>
                      </td>
                      <td className="p-3">{colab.Nome}</td>
                      <td className="p-3 text-gray-300">ID: {colab.id}</td>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selecionados.includes(colab.id)}
                          onChange={() => handleSelecionarCheckbox(colab.id)}
                          className="accent-purple-500 w-5 h-5"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Botão Concluir */}
        {colaboradoresFiltrados.length > 0 && (
          <div className="mt-6 flex justify-start gap-4 mt-20">
                    <ButtonCancelar onClick={onClose} />
                    <ButtonConcluir onClick={() => { handleConcluirSelecao();}} />
                  </div>
        )}
      </div>
    </Dialog>
  );
}
