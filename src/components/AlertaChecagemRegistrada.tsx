"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import checkOk from "/public/AlertaChecagemRegistrada.svg";
import ok from "/public/Ok.svg";

interface AlertaChecagemRegistradaProps {
  aberto: boolean;
  onFechar: () => void;
}

export default function AlertaChecagemRegistrada({
  aberto,
  onFechar,
}: AlertaChecagemRegistradaProps) {
  return (
    <Dialog open={aberto} onClose={onFechar} className="relative z-50">
      {/* Fundo escuro translúcido */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Container centralizado */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xs rounded bg-[#1D1833] text-white p-6 text-center flex flex-col items-center gap-6 shadow-lg border border-[#292343]">
  
          <Image src={checkOk} alt="Checagem registrada" width={40} height={40} />
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="mt-2 hover:scale-105 transition duration-200"
          >
            <Image src={ok} alt="Botão Ok" width={130} height={40} />
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
