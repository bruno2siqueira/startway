# Documento de Requisitos - Ferramenta MVP

## Objetivo Geral
Criar uma ferramenta MVP com três módulos interligados (Problema, Trilha, Mentoria), incorporando a metodologia PROBY com layout de formulário estendido e funcionalidades práticas de validação.

## Módulos

### 1. PLANNER MODULE (Módulo de Problema)

#### 1.1. Interface de Registro de Problemas

Interface com formulário estruturado em 3 etapas para registro e validação de problemas:

**Etapa 1: Registro do Problema**

- **Título do problema:** Campo de texto.
- **Descrição detalhada:** Campo de texto longo com botão de gravação e transcrição de áudio.
- **Público afetado:** Campo de seleção múltipla.
- **Localização:** Campo com mapa ou cidade.
- **Tempo de existência:** Seletor de intervalo.
- **Tentativas anteriores de resolução?:** Opções Sim/Não, com campo de descrição condicional.
- **Gravidade percebida:** Slider de 0 a 10.
- **Número estimado de pessoas afetadas:** Campo numérico.
- **Custo de não resolver:** Campo de múltipla escolha.
- **Soluções semelhantes identificadas?:** Opções Sim/Não, com campo de texto para "onde" condicional.

**Etapa 2: Validação assistida por IA (Yes/Why)**

- Integração de IA que analisa a descrição e sugere formas práticas de validação do problema.

**Etapa 3: Motivadores de Urgência**

- **Por que isso deve ser resolvido agora?:** Campo de texto.
- **Há recursos ou projetos em andamento?:** Opções Sim/Não.
- **Você deseja se engajar na solução?:** Opções Sim/Não.

### 2. Módulo de Trilha de Empreendedorismo

- Gerenciador de conteúdos (vídeos, textos, anexos).
- Trilha gamificada com checkpoints, níveis e progresso visual.

### 3. Módulo de Mentores

- **Cadastro de Mentor:** Nome, minibio, foto, contatos, agenda.
- **Solicitação de Mentoria:** Validação dupla (mentor + mentorado).

## Critérios de Sucesso

- Formulário estruturado com gravação de áudio funcional.
- IA funcional e coerente nas sugestões de validação.
- Trilha interativa com progresso visível.
- Sistema de mentoria operacional com status confirmado de sessões.

## Ponto de Decisão Crítico

Metodologia escolhida para a jornada empreendedora: Lean Startup

## KNOWLEDGE MODULE

- Layout PROBY para coleta e validação de problemas.
- Modelos de trilha gamificada com foco em empreendedorismo social.
- Boas práticas em gestão de mentoria online.
- Transcrição automática de voz para texto com foco em clareza de linguagem.

### Padrões de Busca

- Fontes oficiais da metodologia PROBY.
- Frameworks de trilha gamificada (Coursera, Classcraft).
- Modelos de IA para validação semântica e matching de soluções.
- Bibliotecas de transcrição em PHP ou APIs como Whisper (via backend).

## DATASOURCE MODULE

- Banco de dados relacional (MySQL) com tabelas para usuários, problemas, trilhas, mentorias.
- API ou serviço local de geolocalização (mapa).
- Repositório local de mídia para conteúdos da trilha.
- Base de dados para áudio e transcrição.

### Critérios de Validação Cruzada

- Conferência entre problemas e localizações semelhantes.
- Matching entre mentorias disponíveis e área de atuação do problema.
- Rastreamento de progresso por usuário (log de eventos).

## FERRAMENTAS E FLUXO DE EXECUÇÃO

- **Shell:** Para organizar estrutura de projeto.
- **Browser:** Para consultar dados da metodologia e ferramentas externas.
- **File:** Para geração de documento de requisitos e organização de entregáveis.
- **notify_user:** Para avisos de progresso automático.
- **ask_user:** Para definição da metodologia da trilha.

## DOCUMENTAÇÃO E ORGANIZAÇÃO

- Gerar `documento_de_requisitos.md` contendo campos do formulário, fluxos e wireframes.

### Pastas

- `/formulario/` – HTML+PHP do formulário.
- `/trilha/` – gerenciador de conteúdos.
- `/mentores/` – cadastro e lógica de mentorias.
- `/assets/audio/` – gravações do usuário.
- `/requisitos/` – arquivo `.html` e `.md`.

### Entregáveis Finais

- MVP navegável com layout Bootstrap.
- Documentação completa e comentada.


