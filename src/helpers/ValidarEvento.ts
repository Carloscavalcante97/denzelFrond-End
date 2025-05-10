// helpers/validarEventoFront.ts

interface EventoFront {
  nome: string;
  local: string;
  referencia: string;
  inicioData: string;
  fimData: string;
  dataMontagem: string;
  dataDesmontagem: string;
  inicioHora: string;
  fimHora: string;
  horaMontagem: string;
  horaDesmontagem: string;
}

interface ErrosValidacao {
  [key: string]: string;
}

export function validarEventoFront(evento: EventoFront): ErrosValidacao {
  const erros: ErrosValidacao = {};

  const horaRegex = /^\d{2}:\d{2}$/;
  const isDataInvalida = (data: string) => isNaN(new Date(data).getTime());

  if (!evento.nome?.trim()) erros.nome = "Nome do evento é obrigatório.";
  if (!evento.local?.trim()) erros.local = "Local do evento é obrigatório.";
  if (!evento.referencia?.trim())
    erros.referencia = "Ponto de referência é obrigatório.";

  if (isDataInvalida(evento.inicioData))
    erros.inicioData = "Data de início inválida.";
  if (isDataInvalida(evento.fimData)) erros.fimData = "Data de fim inválida.";
  if (isDataInvalida(evento.dataMontagem))
    erros.dataMontagem = "Data de montagem inválida.";
  if (isDataInvalida(evento.dataDesmontagem))
    erros.dataDesmontagem = "Data de desmontagem inválida.";

  const dataInicio = new Date(evento.inicioData);
  const dataFim = new Date(evento.fimData);
  const montagemInicio = new Date(evento.dataMontagem);
  const montagemFim = new Date(evento.dataDesmontagem);

  if (montagemInicio > dataInicio)
    erros.dataMontagem = "Montagem deve ser antes do início do evento.";
  if (montagemInicio > montagemFim)
    erros.dataMontagem = "Início da montagem deve ser antes do término.";
  if (dataInicio > dataFim)
    erros.inicioData = "Início do evento deve ser antes do fim.";

  if (!horaRegex.test(evento.inicioHora))
    erros.inicioHora = "Hora de início inválida.";
  if (!horaRegex.test(evento.fimHora)) erros.fimHora = "Hora de fim inválida.";
  if (evento.inicioHora >= evento.fimHora)
    erros.inicioHora = "Hora de início deve ser antes da de fim.";

  if (!horaRegex.test(evento.horaMontagem))
    erros.horaMontagem = "Hora da montagem inválida.";
  if (!horaRegex.test(evento.horaDesmontagem))
    erros.horaDesmontagem = "Hora da desmontagem inválida.";

  return erros;
}
