import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      try {
        const result = await graphql({
          schema,
          source: query,
          variableValues: variables,
          contextValue: {
            prisma: fastify.prisma,
          },
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export default plugin;
