# Governança de Workflow (37-39)

37. **Triagem de Requisições:** Toda solicitação feita deve ser verificada contra o `backlog.md`. Se não estiver lá, deve ser adicionada antes da implementação.
38. **Integridade de Boas Práticas:** Nenhuma solicitação deve ser implementada se violar os princípios de boas práticas (regras 1-31). Em caso de conflito, alerte o usuário e proponha uma alternativa adequada.
39. **Limite de Tamanho de Arquivo:** Se qualquer arquivo de governança (`rules.md`, `SDD.md`, `backlog.md`, `history.md`) ultrapassar 1000 caracteres, ele deve ser dividido em múltiplos arquivos e devidamente referenciado no arquivo principal.
40. **Definição de Concluído (DoD):** Uma tarefa do backlog só pode ser marcada como concluída se TODOS os testes (unitários, integrados e validação em produção) passarem com sucesso.
