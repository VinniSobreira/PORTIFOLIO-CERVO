import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const LEADS_KEY = 'cervo-digital:leads';

// Endpoint simples para conferir os leads recebidos.
// Acesse: /api/leads?token=SEU_ADMIN_TOKEN
// Defina ADMIN_TOKEN nas variáveis de ambiente da Vercel.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  }

  const token = req.query.token;
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Não autorizado.' });
  }

  try {
    const raw = await redis.lrange(LEADS_KEY, 0, 99);
    const leads = raw.map((item) => (typeof item === 'string' ? JSON.parse(item) : item));
    return res.status(200).json({ ok: true, total: leads.length, leads });
  } catch (err) {
    console.error('Erro ao listar leads:', err);
    return res.status(500).json({ ok: false, error: 'Erro interno.' });
  }
}
