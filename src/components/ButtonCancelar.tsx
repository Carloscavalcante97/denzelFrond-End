import { ChevronLeft } from "lucide-react";
import { JSX } from "react";


interface ButtonCancelarProps {
    onClick: () => void;
  }

export default function ButtonCancelar({ onClick }: ButtonCancelarProps): JSX.Element {
  return (
    <button
    onClick={onClick}
     className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-tl-[30px] rounded-bl-[30px] border border-solid border-white text-white font-PADR-o text-[16px] font-light transition hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded-l-4xl"

      >
      <ChevronLeft className="h-3.5 w-3.5" />
      <span>Cancelar</span>
    </button>
  );
}
