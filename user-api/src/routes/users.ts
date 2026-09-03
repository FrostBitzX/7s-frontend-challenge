import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { fetchAllUsers } from '../services/fetchService';
import { groupUsersByDepartment } from '../services/transformService';
import { defaultCache } from '../services/cacheService';

const CACHE_KEY = 'by-department';
const CACHE_TTL_SECONDS = 60;

export const usersRoute: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/api/users/by-department', async (request, reply) => {
    try {
      // 1. Check cache first for maximum throughput
      const cached = defaultCache.get(CACHE_KEY);
      if (cached) {
        reply.header('X-Cache', 'HIT');
        return reply.status(200).send(cached);
      }

      // 2. Fetch all users from upstream API
      const startTime = Date.now();
      const users = await fetchAllUsers();
      const fetchTime = Date.now() - startTime;

      // 3. Transform data using single-pass O(n) algorithm
      const transformStart = Date.now();
      const groupedData = groupUsersByDepartment(users);
      const transformTime = Date.now() - transformStart;

      fastify.log.info({
        msg: 'Users grouped successfully',
        userCount: users.length,
        departmentCount: Object.keys(groupedData).length,
        fetchTimeMs: fetchTime,
        transformTimeMs: transformTime,
      });

      // 4. Save to cache
      defaultCache.set(CACHE_KEY, groupedData, CACHE_TTL_SECONDS);

      reply.header('X-Cache', 'MISS');
      reply.header('Server-Timing', `fetch;dur=${fetchTime}, transform;dur=${transformTime}`);
      return reply.status(200).send(groupedData);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(502).send({
        error: 'Bad Gateway',
        message: error instanceof Error ? error.message : 'Failed to fetch or transform upstream user data',
      });
    }
  });
};
