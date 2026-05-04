import 'dotenv/config';
import Fastify from 'fastify';
import { ColetaController } from './controllers/ColetaController.js';

const fastify = Fastify({
  logger: true
});

const coletaController = new ColetaController();

// Rotas
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.post('/v1/coletas', (req, rep) => coletaController.handleCreate(req, rep));

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 API Rodando em http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
