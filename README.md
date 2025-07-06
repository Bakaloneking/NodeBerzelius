# Berzelius - Sistema de Gestão Laboratorial

![Captura de Tela do Calendário](https://i.imgur.com/g0tX8fM.png) <!-- Sugestão: Tire uma screenshot final e atualize este link -->

**Berzelius** é uma aplicação web completa, construída com Node.js e Express, projetada para gerenciar as operações de laboratórios de química em um ambiente acadêmico. O sistema oferece uma solução integrada para o agendamento de aulas, controle de usuários com diferentes níveis de permissão, gerenciamento de inventário de reagentes e consulta de informações químicas.

Desenvolvido por **Carlos Nascimento & Deborah Castro**.

---

## ✨ Funcionalidades Principais

O sistema é dividido em módulos que atendem às necessidades de diferentes tipos de usuários:

#### Gestão Acadêmica e de Horários
* **Calendário Dinâmico:** Visualização da grade de horários semanal, com aulas, professores e turmas preenchidos dinamicamente a partir do banco de dados.
* **Agendamento de Aulas:** Formulário protegido para que técnicos e professores possam agendar novas aulas na grade de horários.
* **Painéis de Controle por Cargo:** Interfaces personalizadas para Técnicos, Professores e Alunos, cada uma com as ferramentas e informações relevantes para sua função.

#### Autenticação e Usuários
* **Sistema de Login Seguro:** Autenticação baseada em sessão para proteger as rotas e funcionalidades da aplicação.
* **Gerenciamento de Papéis (Roles):** Sistema de permissão que diferencia o que cada tipo de usuário (Técnico, Professor, Aluno) pode ver e fazer.
* **CRUD de Usuários:** Interface para técnicos administrarem os cadastros de professores e alunos.
* **Upload de Foto de Perfil:** Funcionalidade para os usuários personalizarem seus perfis com uma foto.

#### Módulos de Consulta Química
* **Tabela Periódica Interativa:** Renderizada dinamicamente com os dados de 118 elementos armazenados no banco de dados.
* **Preparo de Soluções:** Página que lista os procedimentos para preparar diversas soluções químicas.
* **Catálogo de Vidrarias:** Galeria visual com as principais vidrarias de laboratório.

#### Gestão de Laboratório
* **Controle de Inventário:** Funcionalidade para gerenciar o estoque de reagentes e outros insumos.
* **Estrutura Relacional:** Banco de dados robusto que conecta substâncias, soluções, elementos e o inventário de forma lógica.

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)

A aplicação foi construída utilizando um conjunto de tecnologias modernas e robustas do ecossistema JavaScript/Node.js.

* **Back-end:**
    * **Node.js:** Ambiente de execução para o JavaScript no servidor.
    * **Express.js:** Framework web para gerenciamento de rotas, middlewares e requisições.
* **Banco de Dados:**
    * **MySQL:** Sistema de gerenciamento de banco de dados relacional.
    * **Sequelize:** ORM (Object-Relational Mapper) para interagir com o banco de dados de forma segura e organizada, usando modelos JavaScript.
* **Front-end / Template Engine:**
    * **Handlebars.js:** Motor de templates para renderizar páginas HTML dinâmicas no servidor.
* **Ferramentas Adicionais:**
    * **`body-parser`:** Middleware para processar dados de formulários.
    * **`express-session` & `cookie-parser`:** Para gerenciamento de sessões e autenticação de usuários.
    * **`multer`:** Middleware para gerenciar o upload de arquivos (fotos de perfil).
    * **`nodemon`:** Ferramenta de desenvolvimento para reiniciar o servidor automaticamente após alterações no código.

---

## 🚀 Instalação e Execução do Projeto

Para rodar este projeto localmente, siga os passos abaixo:

**1. Pré-requisitos:**
* Ter o [Node.js](https://nodejs.org/) instalado.
* Ter um servidor MySQL em execução.

**2. Clone o Repositório:**
```bash
git clone [https://github.com/seu-usuario/berzelius-gestao.git](https://github.com/seu-usuario/berzelius-gestao.git)
cd berzelius-gestao
