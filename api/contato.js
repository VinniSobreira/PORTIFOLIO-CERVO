import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const LEADS_KEY = 'cervo-digital:leads';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  }

  try {
    const { nome, email, mensagem } = req.body || {};

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ ok: false, error: 'Preencha nome, e-mail e mensagem.' });
    }

    if (String(nome).length > 200 || String(email).length > 200 || String(mensagem).length > 5000) {
      return res.status(400).json({ ok: false, error: 'Campo muito longo.' });
    }

    const lead = {
      nome: String(nome).trim(),
      email: String(email).trim(),
      mensagem: String(mensagem).trim(),
      criadoEm: new Date().toISOString(),
    };

    // guarda o lead numa lista no Upstash Redis (mais recente primeiro)
    await redis.lpush(LEADS_KEY, JSON.stringify(lead));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar lead no Upstash:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno. Tente novamente em instantes.' });
  }
}
