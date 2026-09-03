import Fastify from 'fastify';
import cors from '@fastify/cors';
import { usersRoute } from './routes/users';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

async function main() {
  try {
    await fastify.register(cors, {
      origin: true,
    });

    // Health check endpoint
    fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

    // Register User API routes
    await fastify.register(usersRoute);

    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 User API server running on http://localhost:${port}`);
    console.log(`📊 Endpoint available at http://localhost:${port}/api/users/by-department`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
