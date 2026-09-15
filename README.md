# Cervo Digital — site institucional

Site estático (`index.html` + Tailwind via CDN) com um formulário de contato
que salva os leads no Upstash Redis através de uma função serverless da Vercel.

```
cervo-digital/
├── index.html          → o site em si
├── assets/
│   └── logo-cervo.png  → sua logo
├── api/
│   ├── contato.js       → recebe o formulário e grava no Upstash
│   └── leads.js         → lista os leads salvos (protegido por token)
├── package.json
├── .env.example
└── .gitignore
```

## 1. Subir no GitHub

```bash
cd cervo-digital
git init
git add .
git commit -m "Site inicial da Cervo Digital"
```

Crie um repositório vazio em github.com/new (ex: `cervo-digital`) e depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/cervo-digital.git
git branch -M main
git push -u origin main
```

## 2. Criar o banco no Upstash

1. Crie uma conta em [upstash.com](https://upstash.com) (tem plano gratuito).
2. Crie um banco **Redis** novo.
3. Na página do banco, abra a aba **REST API** e copie:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## 3. Publicar na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório que você acabou de subir.
2. Não precisa mudar nenhuma configuração de build — é um projeto estático com funções em `/api`.
3. Antes de clicar em **Deploy**, adicione as variáveis de ambiente (aba **Environment Variables**):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `ADMIN_TOKEN` — invente uma senha longa, é o que protege a listagem de leads
4. Clique em **Deploy**.

Depois do primeiro deploy, se adicionar ou mudar variáveis de ambiente,
lembre de rodar um **Redeploy** para elas passarem a valer.

## 4. Conferir os leads recebidos

Acesse:

```
https://SEU-DOMINIO.vercel.app/api/leads?token=O_TOKEN_QUE_VOCE_ESCOLHEU
```

Isso devolve um JSON com as últimas mensagens recebidas pelo formulário.
Se quiser algo mais visual no futuro, dá pra transformar isso numa página
simples de admin.

## 5. Domínio próprio e subdomínios

Na Vercel, em **Settings → Domains**, adicione `cervodigital.com.br` e
aponte o DNS conforme as instruções que a própria Vercel mostra.
Cada subdomínio de demonstração (`rh.cervodigital.com.br`,
`logistica.cervodigital.com.br`, `agenda.cervodigital.com.br`) pode ser
um projeto Vercel separado, adicionado do mesmo jeito.

## Antes de publicar de verdade

- Troque o número de WhatsApp (`5500000000000`) pelo seu, no `index.html`.
- Troque `contato@cervodigital.com.br` pelo seu e-mail real.
- Troque os depoimentos de exemplo pelos relatos reais dos seus clientes.
