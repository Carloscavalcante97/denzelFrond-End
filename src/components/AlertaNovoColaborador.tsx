"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import checkOk from "/public/NovoColaboradorAlerta.svg";
import ok from "/public/Concluir.svg";
import Linha from "/public/Linha.png";
import NovoColaboradorButton from "/public/Button Novo Colaborador.svg";

interface AlertaColaboradorRegistradoProps {
  aberto: boolean;
  onFechar: () => void;
  onNovoColaborador: () => void; 
}

export default function AlertaColaboradorRegistrado({
  aberto,
  onFechar,
  onNovoColaborador,
}: AlertaColaboradorRegistradoProps) {
  return (
    <Dialog open={aberto} onClose={onFechar} className="relative z-50">
    {/* Fundo escuro translúcido */}
    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  
    {/* Container centralizado */}
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-md rounded bg-[#1D1833] text-white text-center flex flex-col items-center gap-6 shadow-lg border border-[#292343] relative overflow-hidden p-0">
  
        {/* Linha decorativa no topo do modal */}
        <Image
          src={Linha}
          alt="Linha decorativa"
          width={500}
          height={5}
          className="w-full block"
          priority
        />
  
        {/* Conteúdo do modal */}
        <div className="p-6 flex flex-col items-center gap-6 w-full">
          <Image src={checkOk} alt="Checagem registrada" width={210} height={40} />
  
          {/* Botões lado a lado */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onFechar}
              aria-label="Fechar"
              className="hover:scale-105 transition duration-200"
            >
              <Image src={ok} alt="Botão Ok" width={130} height={40} />
            </button>
  
            <button
              onClick={() => {
                onFechar(); // fecha o modal atual
                onNovoColaborador(); // limpa e reabre o modal anterior
              }}
              className="hover:scale-105 transition duration-200"
              aria-label="Novo Colaborador"
            >
              <Image src={NovoColaboradorButton} alt="Novo Colaborador" width={150} height={80} />
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
  
  );
}
