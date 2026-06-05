# Help-me TI Pro V4

Sistema de chamados com Firebase:
- Login e cadastro
- Novo chamado com anexo em Base64 no Firestore, sem usar Storage pago
- Histórico com filtros por status
- Painel admin com busca, filtros, alteração de status e excluir chamado
- Aba Conversas com notificações de nova resposta
- Chat dentro do chamado
- Número automático #0001, #0002...
- Dashboard com contadores
- Configurações editáveis pelo site
- Relatórios diário, semanal e mensal com CSV
- Transições entre páginas

## Rodar local
```bash
npm install
npm run dev
```

## Firebase necessário
Ative no Firebase:
1. Authentication > E-mail/senha
2. Firestore Database

Storage não é necessário nesta versão.

## Regras Firestore
Use o arquivo `firestore.rules` no Firebase > Firestore > Regras.

## Admin inicial
O admin inicial é:
`auxiliar.ti@fvadvocacia.com.br`

Depois você pode editar até 5 admins dentro da aba Configurações.
