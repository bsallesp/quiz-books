# Fluxos Principais

### Autenticação
1. Usuário insere telefone.
2. Frontend chama `POST /api/SendCode`.
3. Backend gera código, salva no SQL e envia via ACS.
4. Usuário insere código.
5. Frontend chama `POST /api/VerifyCode`.
6. Backend valida e retorna sucesso.

### Realização de Quiz
1. Frontend carrega JSON de questões (atualmente local/assets).
2. Usuário responde.
3. Resultados são submetidos para `POST /api/SubmitResult` (em implementação).
