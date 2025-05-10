// helpers/colaboradores.ts
export const buscarNomePorId = async (id: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://denzel-backend.onrender.com/api/usuarios/BuscarPorId/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.Nome || null;
    }
    return null;
  } catch (err) {
    console.error("Erro ao buscar colaborador por ID:", err);
    return null;
  }
};
