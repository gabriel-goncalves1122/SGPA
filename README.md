# SGPA - Sistema de Gerenciamento de Projetos Acadêmicos

> **Nota:** Este é um projeto de fins estritamente acadêmicos, desenvolvido para consolidar conceitos de Engenharia de Software.

## 📖 Visão Geral
O SGPA é uma aplicação web concebida para centralizar o cadastro, gerenciamento e acompanhamento de projetos acadêmicos. O sistema visa facilitar o controle de orientadores, alunos e a evolução das atividades de pesquisa e extensão.

## 🚀 Funcionalidades (Escopo)
O projeto contempla o gerenciamento completo (CRUD) das seguintes entidades:
* **Gestão de Alunos e Professores:** Cadastro e manutenção de perfis institucionais.
* **Gestão de Projetos:** Criação de projetos com definição de prazos, orientadores e status automático.
* **Módulo de Equipes:** Vinculação de alunos a projetos com definição de papéis (Participante ou Líder).
* **Tarefas e Entregas:** Controle de atividades por equipe, com suporte a envio de arquivos e logs de progresso.
* **Relatórios:** Geração de relatórios de andamento com cálculo automático de produtividade.

## 👥 Perfis de Usuário
* **Administrador:** Gestão global de cadastros, usuários e permissões de acesso.
* **Professor:** Orientação direta de projetos e gestão de tarefas/entregas das suas equipes.
* **Aluno:** Participação em projetos, atualização de progresso e submissão de entregas.

## 🛠️ Requisitos Técnicos e Qualidade
Seguindo as diretrizes de Engenharia de Software estabelecidas, o sistema adota:
* **Arquitetura:** Implementação baseada no padrão MVC.
* **Segurança:** Autenticação com senhas criptografadas via bcrypt e sessões protegidas por cookies httpOnly.
* **Documentação:** Especificação da API seguindo o padrão OpenAPI 3.0.
* **Performance:** Consultas e inserções otimizadas para resposta em menos de 3 segundos.
* **Qualidade:** Garantia de funcionamento via testes automatizados de CRUD com Selenium.

## 👨‍💻 Equipe de Desenvolvimento
* Gabriel Gonçalves
* Gustavo
* Luiz Fernando Costa Silva
* Rafael Pereira Mezzeti
* Vinícius Gomes de Araújo
