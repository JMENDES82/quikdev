#### **Descrição do Projeto**
Este projeto é composto por uma aplicação front-end desenvolvida em React.js com TypeScript e uma aplicação back-end desenvolvida em Node.js com TypeScript utilizando o framework NestJS e banco de dados SQLite. O sistema implementa funcionalidades de autenticação, CRUD para usuários, postagens e comentários, além de recursos adicionais como histórico de edições, contadores de visualizações, curtidas e notificações por e-mail.

##### **Stack Utilizada:**
*   **Linguagem:** TypeScript
*   **Front-end:**
    *   **Framework:** React.js
    *   **Pacotes Adicionais:**
        *   **Axios** (para requisições HTTP)
        *   **React Router** (para rotas)
        *   **Redux ou Context API** (para gerenciamento de estado, se necessário)
        *   **Tailwind** (para estilização)
*   **Back-end:**
    *   **Framework:** NestJS
    *   **Pacotes Adicionais:**
        *   **Prisma** (para ORM com SQLite)
        *   **Passport.js** (para autenticação)
        *   **Nodemailer** (para envio de e-mails)
*   **Banco de Dados:**
    *   **SQLite:** Escolhido pela sua simplicidade e facilidade de configuração para projetos pequenos e médios.


#### **Como Executar o Sistema**

##### **Pré-requisitos:**

*   Node.js instalado (versão 20 ou superior)
*   NPM
*   Git instalado

##### **Clonando o Repositório**

```
git clone https://github.com/seu-usuario/seu-repositorio.git
```

##### **Execuntado a aplicação**

1. Navegue até a pasta do servidor:
```
cd server
```

2. Instale as dependências do server e do client:
```
npm install
```

3.Configure as variáveis de ambiente:
* Crie um arquivo `.env` na raiz do projeto a partir do arquivo `.env.exemple` e configure suas variaveis:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
```
4. Inicialise o server na porta 3000:
```
npm run dev -- --port=3000
```

5. Inicialise o client na porta 3001:
```
PORT=3001 npm start
ou
set PORT=3001 && npm start (Windows)
```

Endpoint para gerar o relatório:

`server_base_URL/report`

##### **Testando**

1. Acesse a aplicação client(front-end):
* `localhost:3001`

2. Cadastre um novo usuário.

3. Faça login e cadastre uma nova postagem.

4. Curta, comente, edite, cadastre outras contas de usuários e divirtace. 