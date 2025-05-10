import Image from "next/image";
import Revisar from "/public/revisarButton.svg";
import VoltarAtivado from "/public/voltarAtivado.svg";
import VoltarDesativado from "/public/VoltarDesativado.svg";
import Finalizar from "/public/FinalizarCadastro.svg"; 

interface NavbarInferiorProps {
  podeVoltar: boolean;
  onVoltar: () => void;
  onRevisar: () => void;
  modoRevisao?: boolean; 
}

export default function NavbarInferior({ podeVoltar, onVoltar, onRevisar, modoRevisao = false }: NavbarInferiorProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1D1933] p-4 flex justify-center gap-4 border-t border-[#292343]">
      {/* Botão Voltar */}
      <button
        onClick={podeVoltar ? onVoltar : undefined}
        disabled={!podeVoltar}
        className="disabled:opacity-50"
      >
        <Image
          src={podeVoltar ? VoltarAtivado : VoltarDesativado}
          alt="Voltar"
          className="hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded-l-4xl"
          width={120}
          height={40}
        />
      </button>

      {/* Botão Revisar ou Finalizar */}
      <button
        onClick={onRevisar}
      >
        <Image
          src={modoRevisao ? Finalizar : Revisar}
          alt={modoRevisao ? "Finalizar" : "Revisar"}
          className="hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded-r-4xl"
          width={120}
          height={40}
        />
      </button>
    </div>
  );
}
