# Tutorial de Deploy (Passo a Passo)

Excelente! O seu código local acaba de ser totalmente modernizado.
O backend original via Localhost (SQLite) foi perfeitamente convertido para um formato mais dinâmico (Vercel Serverless Functions). 

Agora, basta seguirmos três passos fáceis para o seu projeto ir com segurança e estabilidade para a nuvem.

> Requisito: Não esqueça de primeiro enviar (Push) este código atualizado para o seu GitHub, visto que o Vercel irá baixar os arquivos de lá, ok?

---

## Passo 1: Configurar o Banco no Supabase 🐘

Vamos garantir que o banco de dados principal de produção esteja habilitado e com suas tabelas!

1. Conecte no [Painel do Supabase](https://supabase.com).
2. Entre no seu recém-criado projeto.
3. No painel à esquerda, clique na ferramenta de engrenagem (**Project Settings**). Acesse **API** logo abaixo na aba esquerda, lá você verá:
  - Sua `Project URL`.
  - Sua `Project API Keys` (copie a **anon** ou **service_role** key — recomendo usar temporariamente a service_role por evitar regras restritas inicialmente).
4. No mesmo painel do Supabase à esquerda, clique no símbolo que remete ao terminal ou código: **SQL Editor**. Clique em **"New query"** e rode este código abaixo e pressione `Run` para criar as mesmas tabelas antes baseadas em SQLite:

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  date TEXT,
  category TEXT,
  description TEXT,
  type TEXT,
  value REAL,
  payment_method TEXT,
  necessary INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  token TEXT,
  expires_at TEXT
);
```

---

## Passo 2: Fazer o Upload do Projeto para a Vercel 🔼

1. Faça o seu login na [Vercel](https://vercel.com/) (use sua conta do GitHub!).
2. Clique no botão preto no canto superior direito **"Add New..."** e escolha **"Project"**.
3. A Vercel mostrará sua lista de repositórios do GitHub. Clique em **Import** no repo que contém este projeto.
4. Uma tela de configuração final será exibida "Configure Project". Em "Framework Preset", o Vercel provavelmente colocará `Vite` automaticamente — pode deixar as configurações de build inalteradas.

---

## Passo 3: Colar as Chaves do Supabase e Iniciar (Crucial) 🔐

Ainda na tela final "Configure Project" (um pouco abaixo de Build and Output Settings):

1. Clique na aba chamada **Environment Variables**. 
2. Você precisará adicionar estas 3 variáveis primárias a seguir:
   
| Key | Value |
| :--- | :--- |
| `SUPABASE_URL` | *(cole sua project URL copiada do passo 1)* |
| `SUPABASE_KEY` | *(cole sua chave anon ou service_role)* |
| `JWT_SECRET` | `uma_senha_dificil_qualquer123` |

3. Enfim, clique no botão **Deploy**.

A aplicação voltará com a tradicional chuva de confete após concluído! 🎉
