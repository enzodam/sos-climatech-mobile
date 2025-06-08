# SOS Climatech - Aplicativo React Native (TypeScript)

Este projeto é um aplicativo móvel desenvolvido em React Native com TypeScript e Expo, seguindo a estrutura e padrões do projeto de referência `mottu-track-challenge`.

O objetivo é fornecer uma ferramenta para registrar pessoas impactadas por eventos climáticos extremos e gerenciar os próprios eventos, consumindo uma API Java backend (fornecida separadamente).

## 🚀 Funcionalidades

*   **Gerenciamento de Eventos Climáticos:**
    *   Listar todos os eventos cadastrados.
    *   Adicionar novos eventos (tipo, localidade, data, impacto).
    *   Visualizar detalhes de um evento específico.
    *   Editar informações de um evento existente.
    *   Remover um evento.
*   **Gerenciamento de Pessoas Afetadas:**
    *   Listar todas as pessoas cadastradas.
    *   Adicionar novas pessoas (nome, CPF, cidade, evento relacionado).
    *   Visualizar detalhes de uma pessoa específica.
    *   Editar informações de uma pessoa existente.
    *   Remover uma pessoa.
*   **Interface:**
    *   Navegação intuitiva entre telas usando Stack Navigator.
    *   Interface com tema escuro, inspirada no projeto de referência.
    *   Feedback visual para carregamento (loading) e tratamento de erros.

## 🛠 Tecnologias Utilizadas

*   React Native
*   Expo
*   TypeScript
*   React Navigation (Native Stack)
*   Axios (para comunicação com a API)
*   StyleSheet (para estilização)

## ⚙️ Configuração e Execução

1.  **Pré-requisitos:**
    *   Node.js (LTS recomendado)
    *   npm ou yarn
    *   Expo Go app no seu dispositivo móvel (Android/iOS) ou um emulador/simulador configurado.
    *   **API Java Backend:** Certifique-se de que a API Java (`sos-climatech-api`) esteja configurada, rodando e acessível pela rede (geralmente em `http://localhost:8080` ou um IP específico).

2.  **Instalação:**
    *   Clone ou descompacte este repositório.
    *   Navegue até a pasta raiz do projeto (`sos-climatech-app-ts`) pelo terminal.
    *   Execute o comando para instalar as dependências:
        ```bash
        npm install
        # ou
        # yarn install
        ```

3.  **Configuração da API:**
    *   Abra o arquivo `services/api.ts`.
    *   **IMPORTANTE:** Ajuste a constante `API_BASE_URL` para o endereço correto onde sua API Java está rodando e acessível pelo seu dispositivo/emulador.
        *   Para emulador Android padrão: `http://10.0.2.2:8080/api` (se a API estiver em `localhost:8080` na sua máquina).
        *   Para emulador iOS ou dispositivo físico na mesma rede Wi-Fi: Use o endereço IP da sua máquina na rede local (ex: `http://192.168.1.100:8080/api`).

4.  **Execução:**
    *   Com a API Java rodando e o `API_BASE_URL` configurado corretamente, inicie o aplicativo Expo:
        ```bash
        npx expo start
        ```
    *   Siga as instruções no terminal para abrir o aplicativo:
        *   Escaneie o QR code com o app Expo Go no seu celular.
        *   Ou pressione `a` para abrir no emulador Android, `i` para abrir no simulador iOS.

## 👥 Integrantes do Grupo

*   [Nome Completo do Integrante 1] - [RM do Integrante 1]
*   [Nome Completo do Integrante 2] - [RM do Integrante 2]
*   [Nome Completo do Integrante 3] - [RM do Integrante 3]
*   ... (Adicione todos os integrantes)

## 📺 Vídeo de Demonstração

[**Link para o vídeo no YouTube AQUI**]

---

*Desenvolvido como parte do desafio proposto.*

