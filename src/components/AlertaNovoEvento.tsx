"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import checkOk from "/public/EventoCadastrado.svg";
import ok from "/public/Ok.svg";
import Linha from "/public/Linha.png";

interface AlertaEventoRegistradoProps {
  aberto: boolean;
  onFechar: () => void;
}

export default function AlertaEventoRegistrado({
  aberto,
  onFechar,
}: AlertaEventoRegistradoProps) {
  return (
    <Dialog open={aberto} onClose={onFechar} className="relative z-50">
    {/* Fundo escuro translúcido */}
    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  
    {/* Container centralizado */}
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-xs rounded bg-[#1D1833] text-white text-center flex flex-col items-center gap-6 shadow-lg border border-[#292343] relative overflow-hidden p-0">
        
        {/* Linha decorativa no topo do modal */}
        <Image
          src={Linha}
          alt="Linha decorativa"
          width={400} // ou remova se estiver usando w-full
          height={5}
          className="w-full block"
          priority
        />
  
        {/* Conteúdo do modal */}
        <div className="p-6 flex flex-col items-center gap-6 w-full">
          <Image src={checkOk} alt="Checagem registrada" width={210} height={40} />
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="hover:scale-105 transition duration-200"
          >
            <Image src={ok} alt="Botão Ok" width={130} height={40} />
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
  
  );
}
