"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import FecharIcon from "/public/Fechar-Modal.svg";
import LinhaModal from "/public/Linha-Modal.png";
import mudarStatus from "/public/Mudar-Status.svg";
import finalizar from "/public/MudarStatusBottao.svg";
import finalizarHover from "/public/FinalizarChecagemHover.svg";
import statusAvariado from "/public/statusAvariado.svg";
import statusAvariadoMarcado from "/public/statusAvariadoMarcado.svg";
import statusEstoque from "/public/statusEstoque.svg";
import statusEstoqueMarcado from "/public/statusEstoqueMarcado.svg";
import statusExtraviado from "/public/statusExtraviado.svg";
import statusExtraviadoMarcado from "/public/statusExtraviadoMarcado.svg";
import statusUso from "/public/statusUso.svg";
import statusUsoMarcado from "/public/statusUsoMarcado.svg";
import statusManutencao from "/public/StatusManutencao.svg";
import statusManutencaoMarcado from "/public/statusManutencaoMarcado.svg";
import statusRealocacao from "/public/statusRealocacao.svg";
import statusRealocacaoMarcado from "/public/statusRealocacaoHover.svg";
import AlertaStatusModificado from "./AlertaStatusModificado";
import { StaticImageData } from "next/image";

interface ModalMudarStatusProps {
  aberto: boolean;
  onFechar: () => void;
  idsSelecionados: string[];
  onSucesso: () => void;
}

const statusOpcoes = [
  "em estoque",
  "em uso",
  "em manutencao",
  "extraviado",
  "avariado",
  "transposicao"
];

const statusIcons: Record<string, { default: StaticImageData; checked: StaticImageData }> = {
  "em estoque": { default: statusEstoque, checked: statusEstoqueMarcado },
  "em uso": { default: statusUso, checked: statusUsoMarcado },
  "em manutencao": {
    default: statusManutencao,
    checked: statusManutencaoMarcado,
  },
  extraviado: { default: statusExtraviado, checked: statusExtraviadoMarcado },
  avariado: { default: statusAvariado, checked: statusAvariadoMarcado },
  transposicao: { default: statusRealocacao, checked: statusRealocacaoMarcado },
};


export default function ModalMudarStatus({
  aberto,
  onFechar,
  idsSelecionados,
  onSucesso,
}: ModalMudarStatusProps) {
  const [novoStatus, setNovoStatus] = useState<string>("");
  const [carregando, setCarregando] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  const alterarStatus = async () => {
    if (!novoStatus) return alert("Selecione um status.");
    if (!idsSelecionados || idsSelecionados.length === 0) {
      return alert("Nenhum material foi selecionado.");
    }

    setCarregando(true);
    try {
      const response = await fetch(
        "https://denzel-backend.onrender.com/api/materiais/AtualizarStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ids: idsSelecionados.map((id) => Number(id)),
            novoStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar status");

      setMostrarAlerta(true);
      onFechar(); // Fechar modal principal antes de exibir o alerta
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Falha ao atualizar o status.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {/* Modal principal */}
      <Dialog open={aberto} onClose={onFechar} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-[#15112B] border border-[#292343] p-6 text-white flex flex-col items-center text-center relative">
            <button
              onClick={onFechar}
              className="absolute top-4 right-4"
              aria-label="Fechar"
            >
              <Image src={FecharIcon} alt="Fechar" width={24} height={24} />
            </button>

            <Image
              src={mudarStatus}
              alt="Mudar Status"
              width={160}
              height={40}
              className="mb-4"
            />

            <Image src={LinhaModal} alt="Linha" className="mb-4" />

            <div className="flex flex-col items-center justify-center gap-3 mt-2">
              {statusOpcoes.map((status) => (
                <label key={status} className="block">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={novoStatus === status}
                    onChange={() => setNovoStatus(status)}
                    className="sr-only"
                  />
                  <Image
                    src={
                      novoStatus === status
                        ? statusIcons[status].checked
                        : statusIcons[status].default
                    }
                    alt={`Status ${status}`}
                    width={185}
                    height={40}
                    className="cursor-pointer transition duration-200 hover:scale-105"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={alterarStatus}
              disabled={carregando}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="mt-6 w-full max-w-[300px] p-[2px] rounded transition duration-200 disabled:opacity-50"
              aria-label="Confirmar"
            >
              <div className="w-full h-[40px] flex items-center justify-center rounded bg-[#15112B]">
                <Image
                  src={isHovered && !carregando ? finalizarHover : finalizar}
                  alt="Finalizar"
                  
                  width={180}
                  height={30}
                  className={carregando ? "opacity-50 grayscale" : ""}
                />
              </div>
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Alerta final de status modificado */}
      <AlertaStatusModificado
        aberto={mostrarAlerta}
        onFechar={() => {
          setMostrarAlerta(false);
          onSucesso(); // Recarregar ou atualizar a UI principal
        }}
      />
    </>
  );
}
