# Help-me TI Pro

Sistema de chamados com Firebase:
- Login e cadastro
- Novo chamado com anexo
- Histórico do usuário
- Painel admin restrito por e-mail
- Chat dentro do chamado
- Número automático #0001, #0002...
- Dashboard com contadores

## Rodar local
```bash
npm install
npm run dev
```

## Firebase necessário
Ative no Firebase:
1. Authentication > E-mail/senha
2. Firestore Database
3. Storage

## Admins
Edite o arquivo `src/config.js` e coloque até 5 e-mails administradores.

## Regras Firestore
Use o arquivo `firestore.rules` como base.

## Regras Storage
Use o arquivo `storage.rules` como base.
