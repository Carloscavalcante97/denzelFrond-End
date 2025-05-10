"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useFormularioEvento } from "../context/FormularioEventoContext";
import botaoEscolherCliente from "/public/BotaoEscolherCliente.svg";
import botaoEscolherClienteHover from "/public/botaoEscolherClienteHover.svg";

interface BotaoEscolherClienteProps {
  idCliente: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function BotaoEscolherCliente({
  idCliente,
  onClick,
  children = "Escolher Cliente",
}: BotaoEscolherClienteProps) {
  const { setIdCliente } = useFormularioEvento();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    localStorage.setItem("idCliente", idCliente.toString());
    setIdCliente(idCliente);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-flex items-center justify-between gap-2 px-5 py-[10px] text-white text-base font-light transition duration-200"
    >
      <Image
        src={isHovered ? botaoEscolherClienteHover : botaoEscolherCliente}
        alt="Botão Escolher Cliente"
        width={186}
        height={40}
      />
    </button>
  );
}
