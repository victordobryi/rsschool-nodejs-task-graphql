import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import { GraphQLContext } from './app.js';
import { PostType } from './post.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async ({ id }, _args, context: GraphQLContext) => {
        return context.prisma.profile.findUnique({ where: { userId: id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      resolve: async ({ id }, _args, context: GraphQLContext) => {
        return context.prisma.post.findMany({ where: { authorId: id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async ({ id }, _args, context: GraphQLContext) => {
        return context.prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: id } } },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async ({ id }, _args, context: GraphQLContext) => {
        return context.prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: id } } },
        });
      },
    },
  }),
});


export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});


export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});
