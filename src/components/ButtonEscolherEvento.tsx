"use client";

import React from "react";
import Image from "next/image";
import { useFormularioEvento } from "../context/FormularioEventoContext";
import { useRouter } from "next/navigation";
import IconEvento from "/public/Eventos.svg";

interface BotaoSelecionarEventoProps {
  idEvento: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function BotaoSelecionarEvento({
  idEvento,
  onClick,
  children = "Selecionar Evento",
}: BotaoSelecionarEventoProps) {
  const { setIdEvento } = useFormularioEvento();
  const router = useRouter();

  const handleClick = () => {
    setIdEvento(idEvento); 
    if (onClick) onClick(); 
    router.push(`/Checklist-Encarregado/${idEvento}`); 
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-between gap-2 px-5 py-[10px] border border-transparent bg-[#100D1E] text-white text-base font-light rounded-r-full transition duration-300 hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5]"
    >
      <span className="whitespace-nowrap">{children}</span>
      <Image src={IconEvento} alt="Ícone Calendário" width={20} height={20} />
    </button>
  );
}
