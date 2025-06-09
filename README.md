# SOS Climatech - Aplicativo Mobile

Este projeto é um aplicativo móvel desenvolvido em React Native com TypeScript e Expo, parte da iniciativa SOS Climatech. Ele visa ser uma ferramenta essencial para o registro e gerenciamento de informações cruciais durante eventos climáticos extremos, permitindo o cadastro de pessoas afetadas, localidades, recursos disponíveis e registros de ajuda. O aplicativo interage com uma API Java backend para persistência e recuperação de dados.

## 🚀 Funcionalidades

O aplicativo oferece as seguintes funcionalidades principais:

*   **Gerenciamento de Eventos Climáticos:**
    *   Listar, adicionar, visualizar detalhes, editar e remover eventos climáticos.
*   **Gerenciamento de Localidades:**
    *   Listar, adicionar, visualizar detalhes, editar e remover localidades afetadas.
*   **Gerenciamento de Pessoas Afetadas:**
    *   Listar, adicionar, visualizar detalhes, editar, remover e atualizar o status de assistência de pessoas afetadas.
*   **Gerenciamento de Recursos:**
    *   Listar, adicionar, visualizar detalhes, editar e remover recursos (ex: alimentos, água, abrigo).
*   **Gerenciamento de Registros de Ajuda:**
    *   Listar, adicionar, visualizar detalhes, remover e marcar registros de ajuda como não entregues.
*   **Interface Intuitiva:**
    *   Navegação fluida entre telas utilizando Stack Navigator.
    *   Design moderno com tema escuro.
    *   Feedback visual para operações de carregamento e tratamento de erros.

## 🛠 Tecnologias Utilizadas

*   **Frontend:**
    *   React Native
    *   Expo
    *   TypeScript
    *   React Navigation (Native Stack)
    *   Axios (para comunicação com a API)
    *   StyleSheet (para estilização)
*   **Backend (API):**
    *   Java
    *   Spring Boot

## ⚙️ Configuração e Execução

Para configurar e executar o projeto, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

*   Node.js (versão LTS recomendada)
*   npm ou Yarn
*   Expo Go app (no seu dispositivo móvel) ou um emulador/simulador de Android/iOS configurado.
*   **API Java Backend:** A API backend (`sos-climatech-api`) deve estar rodando e acessível. Você pode encontrar a documentação da API em [https://sos-climatech-api.onrender.com/swagger-ui/index.html](https://sos-climatech-api.onrender.com/swagger-ui/index.html).

### Instalação

1.  Clone ou descompacte este repositório para o seu ambiente local.
2.  Navegue até a pasta raiz do projeto (`sos-climatech-mobile-main`) pelo terminal:
    ```bash
    cd sos-climatech-mobile-main
    ```
3.  Instale as dependências do projeto:
    ```bash
    npm install
    # ou
    # yarn install
    ```


### Execução

Com a API Java rodando:

1.  A forma mais fácil de usar a API é através da documentação interativa Swagger. Abra o seguinte link no seu navegador, substituindo o placeholder pela URL real da aplicação no Render:
    ```
    https://sos-climatech-api.onrender.com/swagger-ui/index.html
    ```


2. depois da instalação da dependências, inicie o aplicativo Expo:

```bash
npx expo start
```

Siga as instruções no terminal para abrir o aplicativo:

*   Escaneie o QR code exibido com o aplicativo Expo Go no seu celular.
*   Pressione `a` para abrir no emulador Android.
*   Pressione `i` para abrir no simulador iOS.

## 🌐 Endpoints da API

O aplicativo interage com os seguintes endpoints da API SOS Climatech:

### Eventos Climáticos

*   `GET /api/eventos`: Lista todos os eventos climáticos.
*   `POST /api/eventos`: Cadastra um novo evento climático.
*   `GET /api/eventos/{id}`: Busca um evento climático por ID.
*   `PUT /api/eventos/{id}`: Atualiza um evento climático existente.
*   `DELETE /api/eventos/{id}`: Remove um evento climático por ID.

### Localidades

*   `GET /api/localidades`: Lista todas as localidades.
*   `POST /api/localidades`: Cadastra uma nova localidade.
*   `GET /api/localidades/{id}`: Busca uma localidade por ID.
*   `PUT /api/localidades/{id}`: Atualiza uma localidade existente.
*   `DELETE /api/localidades/{id}`: Remove uma localidade por ID.

### Pessoas Afetadas

*   `GET /api/pessoas`: Lista todas as pessoas afetadas.
*   `POST /api/pessoas`: Cadastra uma nova pessoa afetada.
*   `GET /api/pessoas/{id}`: Busca uma pessoa afetada por ID.
*   `PUT /api/pessoas/{id}`: Atualiza uma pessoa afetada existente.
*   `DELETE /api/pessoas/{id}`: Remove uma pessoa afetada por ID.
*   `PATCH /api/pessoas/{id}/status`: Atualiza o status de assistência de uma pessoa afetada.

### Recursos

*   `GET /api/recursos`: Lista todos os recursos.
*   `POST /api/recursos`: Cadastra um novo recurso.
*   `GET /api/recursos/{id}`: Busca um recurso por ID.
*   `PUT /api/recursos/{id}`: Atualiza um recurso existente.
*   `DELETE /api/recursos/{id}`: Remove um recurso por ID.

### Registros de Ajuda

*   `GET /api/registros-ajuda`: Lista todos os registros de ajuda.
*   `POST /api/registros-ajuda`: Cadastra um novo registro de ajuda (automaticamente marcado como entregue).
*   `GET /api/registros-ajuda/{id}`: Busca um registro de ajuda por ID.
*   `DELETE /api/registros-ajuda/{id}`: Remove um registro de ajuda por ID.
*   `PUT /api/registros-ajuda/{id}/nao-entregue`: Marca um registro de ajuda como NÃO entregue.

## 📺 Vídeo de Demonstração

[https://www.youtube.com/watch?v=W-H_wFn59Bk]

---

## 👨‍💻 Desenvolvedores

| Nome                          | RM      | GitHub |
|-------------------------------|---------|--------|
| Enzo Dias Alfaia Mendes       | 558438  | [@enzodam](https://github.com/enzodam) |
| Matheus Henrique Germano Reis | 555861  | [@MatheusReis48](https://github.com/MatheusReis48) |
| Luan Dantas dos Santos        | 559004  | [@lds2125](https://github.com/lds2125) |


