# Help-me TI Pro

Sistema de abertura de chamados em React + Firebase.

## Recursos

- Login e cadastro com Firebase Auth
- Chamados com número automático: #0001, #0002...
- Histórico do usuário
- Painel Admin restrito a 5 e-mails
- Chat dentro do chamado
- Anexo gratuito em Base64 no Firestore, sem Firebase Storage
- Busca por número, título, nome e e-mail
- Filtro por status
- SLA visual: verde, amarelo e vermelho
- Dashboard com contadores
- Visual premium dark

## Configuração

1. Edite `src/firebase.js` com as credenciais do seu Firebase.
2. Edite `src/config.js` com os e-mails dos administradores.
3. No Firebase, publique o conteúdo de `firestore.rules` em Firestore > Regras.
4. Não precisa ativar Firebase Storage.

## Rodar localmente

```bash
npm install
npm run dev
```

## Observação sobre anexos

Os anexos são salvos como Base64 no Firestore para manter o projeto no plano gratuito. Use imagens pequenas, até 700KB.
