# PLAN INVEST — Plataforma de isca digital

Protótipo completo (frontend + backend) para a plataforma "PLAN INVEST" — planilha financeira inteligente para captura de leads.

Resumo rápido
- Stack: React (Vite) frontend, Express backend, SQLite para persistência (arquivo `data.db`).
- Autenticação: registro/login, senhas criptografadas (bcrypt), JWT para sessões.
- Funcionalidades incluídas neste scaffold:
  - Dashboard com cards resumo
  - Planilha editável básica (CRUD de transações)
  - Endpoints de analytics (categoria que mais consome, gastos inúteis detectados)
  - Gráficos com Chart.js
  - Área de captação com CTA placeholders para WhatsApp / Mentoria (substituir links)

Setup local (Windows / macOS / Linux)
1. Instalar Node.js 18+
2. No terminal, instalar dependências do servidor e cliente:

```bash
# na raiz do projeto
cd server
npm install

cd ../client
npm install
```

3. Inicializar banco e rodar servidor + cliente (em terminais separados):

```bash
# servidor
cd server
npm run dev

# cliente
cd client
npm run dev
```

4. Abrir `http://localhost:5173` (Vite) para acessar o frontend. API no `http://localhost:4000`.

Variáveis de ambiente
- server/.env (exemplo):
  - `JWT_SECRET` — chave secreta para JWT
  - `SUPABASE_URL` — URL do seu projeto Supabase (para deploy serverless)
  - `SUPABASE_KEY` — Service Role or anon key (use Service Role for server-side functions)

Observações
- Este repositório é um scaffold funcional e pronto para customizações visuais e integrações (envio real de e-mail, SMTP, deployment, CDN).
- Quando quiser, me envie o link do WhatsApp e da página de vendas que insiro nos CTAs.

---
Design: paleta preta e laranja, logo SVG minimalista em `client/src/assets/logo.svg`.

CI: 

![CI](https://github.com/<your-username>/<your-repo>/actions/workflows/ci.yml/badge.svg)

Deploy no Vercel
---------------

1. Acesse https://vercel.com e conecte seu repositório GitHub com este projeto.
2. Nas configurações do projeto no Vercel, adicione as variáveis de ambiente (Settings → Environment Variables):
   - `API_URL` — URL do backend (ex: `https://my-backend.example.com`). Se você quer que o backend rode separado do Vercel, hospede-o (Render/Railway) e coloque a URL aqui.
   - `JWT_SECRET` — segredo JWT para produção (marcar como Secret).
   - `FRONTEND_ORIGIN` — URL do frontend (ex: `https://<your-project>.vercel.app`).
3. O `vercel.json` já presente neste repositório configura o build para o diretório `client` (`npm run build`). O Vercel irá rodar `npm install` e `npm run build` na pasta `client` automaticamente.
4. Conecte o projeto e faça um push para `main` — o Vercel irá iniciar uma build automática.

Observações sobre o backend:
- Este repositório contém um backend Express + SQLite. SQLite usa armazenamento em disco e não é adequado para funções serverless com filesystem efêmero. Para produção recomendamos:
  - Hospedar o backend em um serviço dedicado (Render, Railway, DigitalOcean App Platform) e definir `API_URL` para apontar para ele; ou
  - Migrar o banco para um serviço gerenciado (Postgres/Supabase) e adaptar `server` para usar o DB gerenciado; ou
  - Reescrever endpoints críticos como serverless functions e usar um DB remoto (mais trabalho).

Se quiser, eu posso: 1) preparar o `Dockerfile` e `Procfile` para deploy do `server` em Render/Railway, ou 2) converter endpoints selecionados para serverless no Vercel (exige migrar a persistência do SQLite).
