# 🛒 MY FLUXO DE CAIXA — Automação Comercial & PDV Supermercado

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

O **MY FLUXO DE CAIXA** é uma solução completa e moderna para automação comercial e frente de caixa (PDV) voltada para micro e pequenas empresas (mini-mercados, padarias, papelarias, depósitos de construção e comércio em geral). Inspirado nos melhores sistemas de caixa de supermercado (como o Veloz PDV), unindo alta velocidade de operação a uma retaguarda gerencial rica e inteligência de mercado.

---

## 🌟 Principais Funcionalidades

### 🖥️ 1. Frente de Caixa (PDV Supermercado)
- **Visor LCD Neon de Alta Visibilidade**: Apresenta em tempo real a quantidade acumulada (`1,000 X` ou `3*código`), total de itens e total da compra.
- **Entrada Rápida & Leitor de Código de Barras**: Aceita leitor EAN-13 ou digitação com multiplicador direto no teclado (ex: `3*136`, `3x136`, `2,5*136`).
- **Teclas de Atalho de Operador**:
  - `F1`: Consulta rápida de produtos por descrição ou código.
  - `F2`: Nova Venda / Limpar Caixa.
  - `F3`: Cancelar item selecionado.
  - `F4`: Aplicar desconto percentual na compra.
  - `F5` / `F6`: Encerramento da Venda & Pagamento.
  - `ESC`: Limpar código de barras / Fechar modais.
- **Múltiplas Formas de Pagamento**:
  - **Dinheiro**: Cálculo automático de troco.
  - **Pix**: Geração visual de QR Code.
  - **Cartão de Crédito e Débito**.
  - **Crediário / Fiado**: Lançamento direto na conta do cliente com limite de crédito.
- **Emissão de Cupom Não Fiscal**: Visualização e impressão térmica formatada (80mm/58mm) e PDF.
- **Controle de Gaveta Eletrônica**: Compatível com simulação e envio de comandos para gavetas (ex: Menno MGI 40AC).

---

### 📊 2. Retaguarda Gerencial
- **Dashboard & Gráficos Interativos (Chart.js)**:
  - Faturamento total, ticket médio e gráfico de vendas semanais.
  - Distribuição de faturamento por meio de pagamento.
  - Alerta visual de produtos abaixo do estoque mínimo.
- **Inteligência de Mercado ClickSuper (Tavily Bridge)**:
  - Comparação automática dos preços da loja contra a média regional de supermercados (ClickSuper Market Index).
  - Ponte de raspagem de preços em tempo real via **Tavily Search API** (`tavily_service.py`).
  - Selo de Navegação Segura e criptografia de dados **SSL/TLS 256-bit** (LGPD Compliant).
- **Cadastro de Produtos**:
  - Código de barras EAN-13 com gerador aleatório.
  - Preço de custo, preço de venda, margem de lucro e unidades (`UN`, `KG`, `CX`, `PCT`, `LT`).
- **Clientes & Crediário (Fiado)**:
  - Controle de limites de crédito e saldos devedores.
  - Modal de quitação de débitos com emissão de recibo de pagamento.
- **Fornecedores & Entrada de Mercadorias**:
  - Cadastro de distribuidores e reposição de estoque com atualização de preço de custo.
- **Financeiro**:
  - Gestão de Contas a Pagar e Contas a Receber com baixa de lançamentos.
- **Movimentação de Caixa**:
  - Registro de Sangrias de segurança, Suprimentos de troco e Fechamento de Caixa com apuração de quebra.
- **Relatórios & Backup**:
  - Relatórios gerenciais exportáveis e impressores.
  - Cópia de segurança em arquivo `.json` (Exportar / Importar).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript + Vite 6
- **Estilização**: Tailwind CSS + Lucide React Icons
- **Gráficos**: Chart.js + React-ChartJS-2
- **Backend / Microserviço Scraper**: Python (HTTP Server) + Tavily API Integration
- **Efeitos de UX**: Canvas-Confetti (Animações de encerramento de venda)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** v18+ instalado.
- **Python** 3.9+ instalado (opcional, para o microserviço Tavily).

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/claudemirpc68-del/MINI_FLUXO_CAIXA.git
cd MINI_FLUXO_CAIXA
```

### Passo 2: Instalar Dependências Frontend
```bash
npm install
```

### Passo 3: Iniciar o Servidor Web (PDV & Retaguarda)
```bash
npm run dev
```
O aplicativo estará disponível em: **`http://localhost:3000`**

### Passo 4: Iniciar a Ponte Tavily ClickSuper (Opcional)
Em um novo terminal, execute:
```bash
python tavily_service.py
```
A ponte de pesquisa de preços em tempo real estará rodando em: **`http://localhost:5000`**

---

## 🔒 Navegação Segura e Criptografia

Conforme os padrões do mercado varejista e integração ClickSuper:
- Todo o tráfego de dados e comunicações da API é simulado com **criptografia SSL/TLS 256-bit**.
- Proteção de dados e cadastros sensíveis de clientes de acordo com a **LGPD (Lei Geral de Proteção de Dados)**.

---

## 📝 Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).

---
*Desenvolvido por Claudemir com suporte de IA Antigravity (Google DeepMind).*