const { ValidationError, NotFoundError } = require('../errors/AppError');

const TIPOS = ['entrega', 'retirada'];
const PRIORIDADES = ['baixa', 'normal', 'alta'];
const STATUS = ['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'];

const TRANSICOES = {
  recebido: ['em_preparacao', 'cancelado'],
  em_preparacao: ['enviado', 'cancelado'],
  enviado: ['entregue'],
  entregue: [],
  cancelado: [],
};

let pedidos = [];
let proximoId = 1;

function validarNovoPedido(dados) {
  if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new ValidationError('O corpo da requisição deve ser um objeto JSON');
  }

  const { cliente, tipo, valor, prioridade } = dados;
  const erros = [];

  if (typeof cliente !== 'string' || cliente.trim() === '') {
    erros.push('cliente é obrigatório e deve ser um texto não vazio');
  }
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor <= 0) {
    erros.push('valor deve ser um número maior que zero');
  }
  if (!TIPOS.includes(tipo)) {
    erros.push(`tipo deve ser um dos valores: ${TIPOS.join(', ')}`);
  }
  if (!PRIORIDADES.includes(prioridade)) {
    erros.push(`prioridade deve ser um dos valores: ${PRIORIDADES.join(', ')}`);
  }

  if (erros.length > 0) {
    throw new ValidationError('Dados inválidos', erros);
  }

  return { cliente: cliente.trim(), tipo, valor, prioridade };
}

// O ID na URL deve ser um inteiro positivo; caso contrário, é dado inválido (400).
function validarId(id) {
  if (!/^[1-9]\d*$/.test(String(id))) {
    throw new ValidationError('ID inválido: deve ser um número inteiro positivo');
  }
  return Number(id);
}

function criar(dados) {
  const validos = validarNovoPedido(dados);
  const pedido = { id: proximoId++, ...validos, status: 'recebido' };
  pedidos.push(pedido);
  return { ...pedido };
}

function listar() {
  return pedidos.map((p) => ({ ...p }));
}

function buscarPorId(id) {
  const idNumerico = validarId(id);
  const pedido = pedidos.find((p) => p.id === idNumerico);
  if (!pedido) {
    throw new NotFoundError(`Pedido com id ${idNumerico} não encontrado`);
  }
  return { ...pedido };
}

// Ordem das checagens: formato do ID (400) -> existência (404) -> corpo (400) -> transição (400).
function atualizarStatus(id, dados) {
  const idNumerico = validarId(id);
  const pedido = pedidos.find((p) => p.id === idNumerico);
  if (!pedido) {
    throw new NotFoundError(`Pedido com id ${idNumerico} não encontrado`);
  }

  if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
    throw new ValidationError('O corpo da requisição deve ser um objeto JSON');
  }

  const novoStatus = dados.status;
  if (typeof novoStatus !== 'string' || !STATUS.includes(novoStatus)) {
    throw new ValidationError('Status inválido', [
      `status deve ser um dos valores: ${STATUS.join(', ')}`,
    ]);
  }

  if (!TRANSICOES[pedido.status].includes(novoStatus)) {
    const permitidos = TRANSICOES[pedido.status];
    const dica = permitidos.length
      ? `permitidos a partir de "${pedido.status}": ${permitidos.join(', ')}`
      : `"${pedido.status}" é um status final`;
    throw new ValidationError(
      `Transição inválida de "${pedido.status}" para "${novoStatus}"`,
      [dica]
    );
  }

  pedido.status = novoStatus;
  return { ...pedido };
}

function resetar() {
  pedidos = [];
  proximoId = 1;
}

module.exports = {
  TIPOS,
  PRIORIDADES,
  STATUS,
  TRANSICOES,
  criar,
  listar,
  buscarPorId,
  atualizarStatus,
  resetar,
};
