"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import BuscarEvento from "../../components/BuscarEventos";
import EventoIcon from "/public/Eventos.svg";
import Checklist from "/public/Checklist-Title.svg";
import { IEventos } from "../../@Types/Eventos";
import BotaoSelecionarEvento from "../../components/ButtonEscolherEvento";
import NavPages from "../../components/NavPages";
import Location from "/public/Location.svg";
import Repair from "/public/Repair.svg";
import Alert from "/public/Alert.svg";
import AlertGray from "/public/Alert-Gray.svg";

export default function Eventos() {
  const EVENTOS_URL = "https://denzel-backend.onrender.com/api/eventos/listar";
  const [eventos, setEventos] = useState<IEventos[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    const tokenLocal = localStorage.getItem("token");
    setToken(tokenLocal);
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [token, page]);

  async function fetchEventos() {
    if (!token) return;
    try {
      const response = await fetch(`${EVENTOS_URL}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEventos(Array.isArray(data.data) ? data.data : []);
      setTotalPages(Math.ceil(data.totalItems / limit));
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const eventosFiltrados = eventos.filter((evento) =>
    evento.Nome?.toLowerCase().includes(debouncedSearchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#100D1E] text-white">
      <Header />
      <div className="flex-grow">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Image src={Checklist} alt="Eventos" width={170} height={40} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div className="relative flex items-center w-full md:w-1/3">
              <BuscarEvento value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border-spacing-y-2 text-left px-4 py-3">
              <thead>
                <tr className="text-gray-300">
                  <th className="p-3">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-1">
                        <Image src={EventoIcon} alt="Evento" width={12} height={12} />
                        <span className="font-bold text-white">Nome do Evento</span>
                      </div>
                      <div className="w-[250px] h-[1px] bg-gray-500 mt-1" />
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-1">
                        <Image src={Location} alt="Local" width={12} height={12} />
                        <span className="font-bold text-white">Local</span>
                      </div>
                      <div className="w-[250px] h-[1px] bg-gray-500 mt-1" />
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-1">
                        <Image src={Repair} alt="Montagem" width={12} height={12} />
                        <span className="font-bold text-white">Montagem</span>
                      </div>
                      <div className="w-[200px] h-[1px] bg-gray-500 mt-1" />
                    </div>
                  </th>
                  <th className="p-3">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-1">
                        <Image src={Alert} alt="Alerta" width={12} height={12} />
                        <span className="font-bold text-red-600 text-base">Alerta</span>
                      </div>
                      <div className="w-[150px] h-[1px] bg-red-600 mt-1" />
                    </div>
                  </th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.length > 0 ? (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.Id} className="border-b border-gray-700 hover:bg-[#1D1933] transition">
                      <td className="p-3">{evento.Nome}</td>
                      <td className="p-3">{evento.Local || "Cliente não informado"}</td>
                      <td className="p-3">
                        {evento.MontagemInicio
                          ? new Date(evento.MontagemInicio).toLocaleDateString()
                          : "Data não informada"}
                      </td>
                      <td className="p-3 text-center">
                        {evento.Materiais_Faltando ? (
                          <div className="flex items-center justify-center gap-2 bg-red-600 w-[121px] h-[38px] ">
                            <Image
                              src={AlertGray}
                              alt="Alerta"
                              width={20}
                              height={20}
                            />
                            <span className="text-azul-escuro font-bold">
                              -
                              {evento.Materiais_Faltando.split(", ")
                                .map((item) =>
                                  parseInt(item.match(/\((\d+)\)/)?.[1] || "0", 10)
                                )
                                .reduce((acc, curr) => acc + curr, 0)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">-----</div>
                        )}
                      </td>
                      <td className="p-3">
                        <BotaoSelecionarEvento
                          idEvento={evento.Id}
                          onClick={() => console.log("Evento selecionado:", evento.Id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-gray-400">
                      Nenhum evento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-4 mt-[80px] mb-[40px] pt-4 border-t border-[#292343]">
            <NavPages page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
