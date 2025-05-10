"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ModalAdicionarMaterialNovoEvento from "../../components/ModalAdicionarMaterialNovoEvento";
import MateriaisIcon from "/public/Material.svg";
import QuantidadeIcon from "/public/quantidade.svg";
import CategoriaIcon from "/public/Categoria.svg";
import RedAlert from "/public/Alert.svg";
import Trash from "/public/Lixeira.svg";
import Image from "next/image";
import { getCategoriaIcon } from "../../helpers/GerarImagemCategoria";
import { useFormularioEvento } from "../../context/FormularioEventoContext";
import { useEnviarEvento } from "../../hooks/MontarPayLoader";
import EventoTitle from "/public/NovoEventoTitle.svg";
import Materiais from "/public/Material.svg";
import finalizar from "/public/FinalizarCadastroEvento.svg";
import AlertaEventoRegistrado from "@/components/AlertaNovoEvento";
import { useRouter } from "next/navigation";

interface MaterialSelecionado {
  nome: string;
  quantidade: number;
  categoria: number; 
}

export default function AdicionarMateriais() {
  const [modalAberto, setModalAberto] = useState(false);
  const { materiais, setMateriais, limparFormulario } = useFormularioEvento();
  const [modalSucesso, setModalSucesso] = useState(false);
const router = useRouter();
  const enviarEvento = useEnviarEvento();
  const alocarMateriais = (novosMateriais: MaterialSelecionado[]) => {
    setMateriais((materiaisAtuais) => {
      const mapa = new Map<string, MaterialSelecionado>();
      materiaisAtuais.forEach((mat) => mapa.set(mat.nome, mat));
      novosMateriais.forEach((mat) => mapa.set(mat.nome, mat));
      return Array.from(mapa.values());
    });
    setModalAberto(false);
  };
  const handleEventos = () => {
    router.push("/Eventos");
  }
  const removerMaterial = (index: number) => {
    setMateriais((prev) => prev.filter((_, i) => i !== index));
  };
  const handleVoltar = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <main className="flex-grow px-4 sm:px-8 md:px-16 lg:px-[320px] py-10 flex flex-col gap-10">
        {/* Título e botão */}
        <div className="flex items-center justify-between">
         <Image src={EventoTitle} alt="Evento" className="w-[235px] h-[40px]"/>

        </div>
 <div className="flex flex-wrap gap-2 items-center text-base font-light">
        <span className="text-gray-700">Cliente</span>
        <span className="text-gray-700">&gt;</span>
        <span className="text-gray-700">Evento</span>
        <span className="text-sky-400">&gt;</span>
        <span className="text-sky-400">Solicitação de Materiais</span>
        
      </div>
        {/* Tabela de Materiais */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292343] text-sm text-white">
                <th className="py-2">
                  <div className="flex items-center gap-2">
                    <Image src={MateriaisIcon} alt="Materiais" width={16} height={16} />
                    <span>Materiais</span>
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex items-center gap-2">
                    <Image src={QuantidadeIcon} alt="Quantidade" width={16} height={16} />
                    <span>Quantidade</span>
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex items-center gap-2">
                    <Image src={CategoriaIcon} alt="Categoria" width={16} height={16} />
                    <span>Categoria</span>
                  </div>
                </th>
                <th className="py-2">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <Image src={RedAlert} alt="Alerta" width={16} height={16} />
                      <span className="text-red-600 font-bold">Alerta</span>
                    </div>
                    <div className="w-[80px] h-[1px] bg-red-600 mt-1" />
                  </div>
                </th>
                <th className="py-2">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((mat, index) => (
                <tr key={index} className="border-b border-[#292343] text-white text-sm">
                  <td className="py-3">{mat.nome}</td>
                  <td>{mat.quantidade}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Image
                        src={getCategoriaIcon(mat.categoria)}
                        alt="Ícone categoria"
                        width={18}
                        height={18}
                      />
                      <span>{mat.categoria}</span>
                    </div>
                  </td>
                  <td className="text-red-400"> {/* alerta pode ser condicional depois */} </td>
                  <td>
                    <button onClick={() => removerMaterial(index)}>
                      <Image src={Trash} alt="Excluir" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div>
 <button
            className="flex items-center gap-2 text-white px-4 py-2 rounded bg-[#100D1E] hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 border border-slate-200"
            onClick={() => setModalAberto(true)}
            >
            <Image src={Materiais} alt="Material" width={20} height={20} />
            <span>Adicionar Material</span>
          </button>
        </div>
        {/* Modal */}
        {modalAberto && (
          <ModalAdicionarMaterialNovoEvento
            onClose={() => setModalAberto(false)}
            onSelecionar={alocarMateriais}
          />
        )}

        {/* Navegação */}
        <div className="flex justify-between mt-8">
          <button className="px-6 py-2  h-[40px] border border-slate-200 text-white  hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded-l-4xl" onClick={handleVoltar}>◀ Voltar</button>
          
          <button
  className="px-6 py-2 rounded-r-[30px] text-white"
  onClick={async () => {
    const sucesso = await enviarEvento.enviarEvento();
    if (sucesso)  limparFormulario(); setModalSucesso(true); handleEventos();
  }}
>
  <Image
    className="h-[40px] hover:bg-gradient-to-r hover:from-[#9C60DA] hover:to-[#43A3D5] rounded-r-4xl"
    alt="finalizar"
    src={finalizar}
  />
</button>

          
        </div>
      </main>
      {modalSucesso && (
  <AlertaEventoRegistrado onFechar={() => setModalSucesso(false)} aberto={true} />
)}


      <Footer />
    </div>
  );
}
