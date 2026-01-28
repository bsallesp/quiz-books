# Histórico de Tarefas Concluídas

## 2026-01-27
- **UI de Configurações:** Implementação de painel de configurações na tela inicial, permitindo seleção de quantidade de questões (10, 20, 30, 50, 100) e toggle para feedback imediato.
- **Bugfix (Stats):** Correção do carregamento infinito de estatísticas (regra de firewall Azure adicionada e tratamento de erro no `StatsComponent`).
- **Refatoração de Rotas:** Implementação de GUIDs para cursos e atualização das rotas para incluir o ID do curso (`/quiz/:id`). Melhoria na robustez da navegação e redirecionamentos em caso de estado inválido.
- **Conteúdo (CompTIA A+):** Atualização dos nomes dos capítulos no arquivo JSON do curso "CompTIA A+ Certification". Substituição de nomes genéricos ("Chapter 1") por títulos descritivos ("Chapter 1: Safety and Operational Procedures") para melhorar a experiência do usuário.
- **Bugfix (QuizService):** Correção do erro "Loading chapters... (or none found)" no curso CompTIA A+ 2024. A lógica de ordenação foi alterada para suportar nomes de capítulos não numéricos (alfanumérico) e garantir o carregamento prévio das questões.
- **Setup Inicial:** Configuração do ambiente de desenvolvimento local.
- **Dependências:** Instalação de pacotes npm para frontend e backend.
- **Configuração de Proxy:** Criação do `proxy.conf.json` para desenvolvimento local do Angular com Azure Functions.
- **Configuração de Ambiente:** Criação do `local.settings.json` com connection strings (SMS).
- **Descoberta de Recursos:** Mapeamento dos recursos existentes no Azure (`quiz-books-rg`, `thelaser-space-vault`).
