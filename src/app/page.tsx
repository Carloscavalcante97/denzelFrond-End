"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalAlterarSenha from '@/components/ModalAlterarSenha';
import { pegarDadosDoToken } from '@/helpers/JwtDecoder';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://denzel-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao realizar o login.");
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      if (data.usuario?.QuantidadeAcessos === 0) {
        setMostrarModalSenha(true);
        return;
      }

      await verificarEventoOuRedirecionar();

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const verificarEventoOuRedirecionar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const usuario = pegarDadosDoToken();
      if (!usuario?.id) return;

      const response = await fetch(`https://denzel-backend.onrender.com/api/usuarios/buscar/${usuario.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      if (!response.ok) throw new Error("Erro ao buscar colaborador.");
      
      const data = await response.json();

      // 🚨 Se não for encarregado, manda para home padrão
     console.log(data);
      const cargo = data.funcao;

const isEncarregado = cargo === "Encarregado Iluminacao"|| cargo === "Encarregado Estrutura";
console.log("Cargo:", cargo);
console.log("É encarregado?", isEncarregado);

if (!isEncarregado) {
  router.push('/clientes');
  return;
}

      console.log(data.IdMontagem, data.IdDesmontagem);
      const idEvento = data.IdMontagem || data.IdDesmontagem;
console.log("ID evento:", idEvento);

      if (idEvento) {
        router.push(`/Checklist-Encarregado/${idEvento}`);
      } else {
        setMensagem("Sem eventos atribuídos no momento.");
      }

    } catch (error) {
      console.error("Erro ao verificar evento:", error);
      setMensagem("Erro ao verificar eventos.");
    }
  };

  return (
    <>
      {mostrarModalSenha && (
        <ModalAlterarSenha
          isOpen={mostrarModalSenha}
          onClose={() => {
            setMostrarModalSenha(false);
            router.push('/clientes');
          }}
        />
      )}

      <div className="min-h-screen flex items-center justify-center bg-[#100D1E]">
        <form onSubmit={handleLogin} className="bg-[#1D1933] p-8 rounded shadow-md w-96 space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text">
            Login
          </h2>

          {error && <p className="text-red-500">{error}</p>}
          {mensagem && <p className="text-yellow-500">{mensagem}</p>}

          <div>
            <label className="text-sm text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-[#1D1933] mb-4 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-[#1D1933] mb-4 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-10 bg-[#292343] text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}
