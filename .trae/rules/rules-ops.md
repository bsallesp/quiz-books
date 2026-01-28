# Boas Práticas de Operações e Segurança (16-31)

16. Use linting e formatação automática (ex: ESLint, Prettier, Black).
17. Configure logs estruturados e níveis apropriados (DEBUG, INFO, WARN, ERROR).
18. Nunca exponha segredos (senhas, chaves) no repositório; use variáveis de ambiente.
19. Otimize apenas quando houver evidência de gargalo (premature optimization).
20. Separe configuração de código; use arquivos .env ou serviços de config.
21. Escreva mensagens de erro amigáveis para usuários e detalhadas para logs.
22. Use tipagem estática ou type hints quando a linguagem permitir.
23. Mantenha dependências atualizadas com revisão de changelogs.
24. Crie índices apropriados no banco de dados e evite N+1 queries.
25. Proteja contra injeção SQL usando prepared statements ou ORM.
26. Implemente rate limiting e throttling em APIs públicas.
27. Faça rollback automático em deploys que falham (blue-green, canary).
28. Monitore métricas de saúde (CPU, memória, latência) em produção.
29. Crie backups automatizados e teste restauração regularmente.
30. Documente decisões de arquitetura (ADR) para facilitar manutenção futura.
31. Sempre mantenha a aplicação rodando localmente (frontend e backend) durante o desenvolvimento para feedback imediato.
