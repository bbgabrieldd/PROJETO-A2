const request = require('supertest');
const app = require('../src/app');
const service = require('../src/services/pedidos.service');

const valido = { cliente: 'Carlos Silva', tipo: 'entrega', valor: 350, prioridade: 'normal' };

beforeEach(() => service.resetar());

describe('POST /pedidos', () => {
  test('201 com pedido criado', async () => {
    const res = await request(app).post('/pedidos').send(valido);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...valido, status: 'recebido' });
  });

  test('400 com mensagem JSON para dados inválidos', async () => {
    const res = await request(app).post('/pedidos').send({ ...valido, cliente: '   ', valor: -1 });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
    expect(res.body.detalhes).toHaveLength(2);
  });

  test('400 para JSON malformado (não é 500)', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Content-Type', 'application/json')
      .send('{"cliente": ');
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/JSON/);
  });

  test('400 quando não há corpo', async () => {
    const res = await request(app).post('/pedidos');
    expect(res.status).toBe(400);
  });
});

describe('GET /pedidos', () => {
  test('200 com lista vazia', async () => {
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('200 com pedidos cadastrados', async () => {
    await request(app).post('/pedidos').send(valido);
    await request(app).post('/pedidos').send({ ...valido, cliente: 'Ana' });
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /pedidos/:id', () => {
  test('200 para pedido existente', async () => {
    await request(app).post('/pedidos').send(valido);
    const res = await request(app).get('/pedidos/1');
    expect(res.status).toBe(200);
    expect(res.body.cliente).toBe('Carlos Silva');
  });

  test('404 para id inexistente', async () => {
    const res = await request(app).get('/pedidos/999');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBeDefined();
  });

  test('400 para id inválido', async () => {
    const res = await request(app).get('/pedidos/abc');
    expect(res.status).toBe(400);
  });
});

describe('PATCH /pedidos/:id/status', () => {
  test('200 para atualização válida', async () => {
    await request(app).post('/pedidos').send(valido);
    const res = await request(app).patch('/pedidos/1/status').send({ status: 'cancelado' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelado');
  });

  test('400 para status inválido', async () => {
    await request(app).post('/pedidos').send(valido);
    const res = await request(app).patch('/pedidos/1/status').send({ status: 'voando' });
    expect(res.status).toBe(400);
  });

  test('400 para transição não permitida', async () => {
    await request(app).post('/pedidos').send(valido);
    const res = await request(app).patch('/pedidos/1/status').send({ status: 'entregue' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/Transição inválida/);
  });

  test('404 para id inexistente', async () => {
    const res = await request(app).patch('/pedidos/999/status').send({ status: 'cancelado' });
    expect(res.status).toBe(404);
  });
});

describe('Rotas desconhecidas e erros inesperados', () => {
  test('404 JSON para rota inexistente', async () => {
    const res = await request(app).get('/qualquer-coisa');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBeDefined();
  });

  test('erro inesperado vira 500 e não 400', async () => {
    const spy = jest.spyOn(service, 'listar').mockImplementation(() => {
      throw new Error('falha interna simulada');
    });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ erro: 'Erro interno do servidor' });
    spy.mockRestore();
    errSpy.mockRestore();
  });
});
