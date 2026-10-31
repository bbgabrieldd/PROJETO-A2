const service = require('../src/services/pedidos.service');
const { ValidationError, NotFoundError } = require('../src/errors/AppError');

const valido = { cliente: 'Carlos Silva', tipo: 'entrega', valor: 350, prioridade: 'normal' };

beforeEach(() => service.resetar());

describe('criar', () => {
  test('cria pedido com status recebido e id sequencial', () => {
    const a = service.criar(valido);
    const b = service.criar(valido);
    expect(a).toEqual({ id: 1, ...valido, status: 'recebido' });
    expect(b.id).toBe(2);
  });

  test('remove espaços nas extremidades do cliente', () => {
    expect(service.criar({ ...valido, cliente: '  Ana  ' }).cliente).toBe('Ana');
  });

  test.each([
    ['cliente vazio', { cliente: '' }],
    ['cliente só com espaços', { cliente: '   ' }],
    ['cliente não texto', { cliente: 123 }],
    ['valor zero', { valor: 0 }],
    ['valor negativo', { valor: -5 }],
    ['valor string', { valor: '350' }],
    ['valor NaN', { valor: NaN }],
    ['tipo desconhecido', { tipo: 'voando' }],
    ['prioridade desconhecida', { prioridade: 'urgentissima' }],
  ])('rejeita %s', (_nome, alteracao) => {
    expect(() => service.criar({ ...valido, ...alteracao })).toThrow(ValidationError);
  });

  test('rejeita corpo que não é objeto', () => {
    expect(() => service.criar(undefined)).toThrow(ValidationError);
    expect(() => service.criar([])).toThrow(ValidationError);
  });
});

describe('buscarPorId', () => {
  test('retorna pedido existente', () => {
    const criado = service.criar(valido);
    expect(service.buscarPorId(criado.id)).toEqual(criado);
  });

  test('lança NotFoundError para id inexistente', () => {
    expect(() => service.buscarPorId(999)).toThrow(NotFoundError);
  });

  test('lança ValidationError para id inválido', () => {
    expect(() => service.buscarPorId('abc')).toThrow(ValidationError);
    expect(() => service.buscarPorId('0')).toThrow(ValidationError);
    expect(() => service.buscarPorId('1.5')).toThrow(ValidationError);
  });
});

describe('atualizarStatus', () => {
  test('aceita transição válida', () => {
    const { id } = service.criar(valido);
    expect(service.atualizarStatus(id, { status: 'em_preparacao' }).status).toBe('em_preparacao');
  });

  test('percorre o fluxo completo até entregue', () => {
    const { id } = service.criar(valido);
    service.atualizarStatus(id, { status: 'em_preparacao' });
    service.atualizarStatus(id, { status: 'enviado' });
    expect(service.atualizarStatus(id, { status: 'entregue' }).status).toBe('entregue');
  });

  test('rejeita transição inválida (pula etapa)', () => {
    const { id } = service.criar(valido);
    expect(() => service.atualizarStatus(id, { status: 'entregue' })).toThrow(ValidationError);
  });

  test('rejeita sair de status final', () => {
    const { id } = service.criar(valido);
    service.atualizarStatus(id, { status: 'cancelado' });
    expect(() => service.atualizarStatus(id, { status: 'em_preparacao' })).toThrow(ValidationError);
  });

  test('rejeita repetir o mesmo status', () => {
    const { id } = service.criar(valido);
    expect(() => service.atualizarStatus(id, { status: 'recebido' })).toThrow(ValidationError);
  });

  test('rejeita status desconhecido ou ausente', () => {
    const { id } = service.criar(valido);
    expect(() => service.atualizarStatus(id, { status: 'xyz' })).toThrow(ValidationError);
    expect(() => service.atualizarStatus(id, {})).toThrow(ValidationError);
    expect(() => service.atualizarStatus(id, undefined)).toThrow(ValidationError);
  });

  test('lança NotFoundError para id inexistente', () => {
    expect(() => service.atualizarStatus(42, { status: 'cancelado' })).toThrow(NotFoundError);
  });
});
