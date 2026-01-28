# System Design Document (SDD) - Quiz Books

## Visão Geral
O **Quiz Books** é uma aplicação web para prática de questões de certificação (ex: CompTIA A+), construída com Angular no frontend e Azure Functions no backend, utilizando Azure SQL Database para persistência.

## Arquitetura

### Frontend
- **Framework:** Angular 19+
- **Hospedagem:** Azure Static Web Apps
- **Estilização:** Tailwind CSS + SCSS
- **Gerenciamento de Estado:** RxJS (BehaviorSubjects em serviços)

### Backend
- **Runtime:** Azure Functions (Node.js/TypeScript)
- **API Style:** REST
- **Autenticação:** Baseada em número de telefone (envio de código via SMS/WhatsApp usando Azure Communication Services)

### Banco de Dados
- **Serviço:** Azure SQL Database
- **Modelo de Dados:** Relacional
  - `VerificationCodes`: Armazena códigos de verificação temporários para login.
  - `UserStats`: (Planejado) Estatísticas de desempenho do usuário.

### Infraestrutura e Segurança
- **Resource Group:** `quiz-books-rg` (Todos os recursos devem residir aqui)
- **Gerenciamento de Segredos:** Azure Key Vault (`quiz-books-kv`)
  - Senhas de banco de dados e connection strings não devem estar no código.
- **CI/CD:** GitHub Actions (Azure Static Web Apps CI/CD)

## Fluxos Principais
Consulte [SDD-flows.md](SDD-flows.md) para detalhes dos fluxos de autenticação e realização de quiz.

