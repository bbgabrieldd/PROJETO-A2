Projeto API de Gerenciamento de Pedidos

PROJETO-A2 · Projeto_API_Gerenciamento_de_Pedidos

Sumário
Informações acadêmicas
Tecnologias utilizadas
Funcionalidades
Instalação e execução
Rotas da API
Regras de validação
Tratamento de erros
Arquitetura do projeto
Testes
Uso de IA e materiais de estudo
Informações acadêmicas
	
Aluno	Gabriel Gallego
RGM	45307601
Disciplina	Tópicos Avançados em Sistemas de Informação II
Turno	Manhã
GitHub	bbgabrieldd
Repositório	PROJETO-A2
Tecnologias utilizadas
Node.js
Express
JavaScript
Jest
Supertest
Postman
Git e GitHub
Funcionalidades

A API possui as seguintes funcionalidades:

Cadastrar novos pedidos.
Listar todos os pedidos cadastrados.
Consultar um pedido pelo ID.
Atualizar o status de um pedido.
Validar os dados enviados nas requisições.
Tratar erros e retornar respostas HTTP adequadas.

Os pedidos são armazenados em memória. Por isso, os dados cadastrados são perdidos quando o servidor é reiniciado.

Instalação e execução
1. Clonar o repositório
bash
git clone https://github.com/bbgabrieldd/PROJETO-A2.git
2. Entrar na pasta do projeto
bash
cd PROJETO-A2/api-pedidos
3. Instalar as dependências
bash
npm install
4. Iniciar o servidor
bash
npm start

Após iniciar, a API estará disponível em:

text
http://localhost:3000
Rotas da API
Método	Rota	Descrição
POST	/pedidos	Cadastrar um pedido
GET	/pedidos	Listar todos os pedidos
GET	/pedidos/:id	Buscar pedido pelo ID
PATCH	/pedidos/:id/status	Atualizar status do pedido
1. Cadastrar pedido

POST /pedidos

Exemplo de corpo da requisição:

json
{
  "cliente": "João Silva",
  "tipo": "entrega",
  "valor": 150.50,
  "prioridade": "alta"
}

Retorno esperado: 201 Created

O pedido é cadastrado com um ID e recebe automaticamente o status inicial recebido.

2. Listar pedidos

GET /pedidos

Retorna uma lista com todos os pedidos cadastrados.

Retorno esperado: 200 OK.

3. Buscar pedido por ID

GET /pedidos/1

Retorna os dados do pedido correspondente ao ID informado.

Retornos possíveis:

200 OK: pedido encontrado.
400 Bad Request: ID inválido.
404 Not Found: pedido não encontrado.
4. Atualizar status do pedido

PATCH /pedidos/1/status

Exemplo de corpo da requisição:

json
{
  "status": "em_preparacao"
}

Retorno esperado: 200 OK, quando a transição for permitida.

Regras de validação

Para cadastrar um pedido, a API verifica:

Cliente: deve ser um texto não vazio.
Valor: deve ser um número maior que zero.
Tipo: deve ser entrega ou retirada.
Prioridade: deve ser baixa, normal ou alta.

Os status disponíveis são:

recebido
em_preparacao
enviado
entregue
cancelado
Transições de status

O pedido segue uma sequência de atualização:

Status atual	Próximos status permitidos
recebido	em_preparacao ou cancelado
em_preparacao	enviado ou cancelado
enviado	entregue
entregue	Nenhum
cancelado	Nenhum

Pedidos com status entregue ou cancelado não podem receber novas atualizações de status.

Tratamento de erros

A API possui um middleware responsável por tratar erros e retornar respostas adequadas.

Código HTTP	Descrição
400	Dados inválidos, ID inválido ou JSON malformado
404	Pedido ou rota não encontrada
500	Erro interno inesperado do servidor

As respostas de erro são retornadas em formato JSON, podendo incluir detalhes sobre o problema.

Arquitetura do projeto

O projeto utiliza uma arquitetura em camadas, separando as responsabilidades de cada parte da aplicação.

text
api-pedidos/
│
├── src/
│   ├── controllers/
│   │   └── pedidos.controller.js
│   │
│   ├── errors/
│   │   └── AppError.js
│   │
│   ├── middlewares/
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   └── pedidos.routes.js
│   │
│   ├── services/
│   │   └── pedidos.service.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── pedidos.api.test.js
│   └── pedidos.service.test.js
│
├── package.json
└── README.md
Responsabilidade das camadas
Camada	Responsabilidade
Routes	Define os endereços e métodos HTTP disponíveis.
Controllers	Recebe as requisições, chama os serviços e retorna as respostas.
Services	Contém as regras de negócio, validações e operações dos pedidos.
Errors	Define as classes utilizadas para representar erros da aplicação.
Middlewares	Realiza o tratamento de erros e de rotas não encontradas.
Tests	Contém os testes automatizados da aplicação.
Testes

O projeto utiliza Jest e Supertest para realizar testes automatizados.

Os arquivos de teste estão organizados em:

tests/pedidos.api.test.js: testes das rotas e respostas da API.
tests/pedidos.service.test.js: testes das regras e operações do serviço de pedidos.

Para executar os testes, utilize:

bash
npm test

Também foram realizados testes manuais utilizando o Postman, verificando o cadastro, a listagem, a validação de dados, a consulta de pedidos inexistentes e a atualização de status.

Uso de IA e materiais de estudo

Durante o desenvolvimento, foram utilizados vídeos do YouTube como material de estudo e apoio para compreender os conceitos e a implementação do projeto.

Uso de IA

Durante o desenvolvimento, foram utilizados vídeos do YouTube como principal material de estudo.

A IA foi utilizada pontualmente para auxiliar na compreensão de alguns códigos, lembrar a estrutura de determinados comandos, identificar e tratar erros e editar e organizar este README.

Uma das sugestões utilizadas foi a explicação de comandos e estruturas do código para facilitar a compreensão durante os estudos. Essa ajuda foi utilizada como apoio ao aprendizado, sem substituir o desenvolvimento realizado pelo aluno.

A implementação e a organização do projeto foram desenvolvidas com base nos estudos e nas atividades realizadas durante o desenvolvimento.