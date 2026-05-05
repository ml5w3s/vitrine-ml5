import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { ColetaController } from './controllers/ColetaController.js';
import { FornecedorController } from './controllers/FornecedorController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

fastify.register(cors, {
  origin: '*', 
});

// Servir arquivos estáticos do Simulador
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../../apps/simulator'),
  prefix: '/', 
});

const coletaController = new ColetaController();
const fornecedorController = new FornecedorController();

// Rotas
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Coletas
fastify.post('/v1/coletas', (req, rep) => coletaController.handleCreate(req, rep));

// Fornecedores
fastify.get('/v1/fornecedores', (req, rep) => fornecedorController.handleList(req, rep));
fastify.post('/v1/fornecedores', (req, rep) => fornecedorController.handleCreate(req, rep));

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
