# Sistema de Chamados TI

Sistema simples para abertura e acompanhamento de chamados de TI.

## Funcionalidades

- Cadastro de usuário
- Login com e-mail e senha
- Abrir novo chamado
- Reportar erro
- Histórico do usuário
- Painel admin para visualizar, responder e alterar status dos chamados

## Como rodar

```bash
npm install
npm run dev
```

## Firebase

1. Acesse o Firebase Console
2. Crie um projeto
3. Ative Authentication > Email/Senha
4. Crie um Firestore Database
5. Copie as configurações do app web
6. Cole no arquivo:

```txt
src/firebase.js
```

## Regras simples do Firestore para teste

Use apenas para teste inicial:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Depois, ajuste as regras para produção.
