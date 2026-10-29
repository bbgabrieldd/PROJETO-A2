# Evidências (Postman)

Coloque aqui as capturas legíveis, mostrando **método, URL, corpo (quando houver), resposta e código HTTP**:

| Arquivo | Cenário |
|---|---|
| 01-criacao.png | POST /pedidos válido → 201 |
| 02-validacao.png | POST /pedidos inválido (ex.: cliente só com espaços) → 400 |
| 03-listagem.png | GET /pedidos → 200 |
| 04-consulta-inexistente.png | GET /pedidos/999 → 404 |
| 05-atualizacao.png | PATCH /pedidos/1/status com `{"status":"em_preparacao"}` → 200 |

Cada integrante do grupo deve gerar os prints rodando a API na própria máquina.
Depois de adicionar os prints, apague este arquivo ou mantenha-o como índice.
