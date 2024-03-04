import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeIdType } from './types/memberType.js';
import { ProfileType } from './types/profile.js';
import { GraphQLContext } from './types/app.js';
import { UUIDType } from './types/uuid.js';
import { PostType } from './types/post.js';
import { UserType } from './types/user.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: {
          type: new GraphQLNonNull(MemberTypeIdType),
        },
      },
      resolve: async (_source, args, context: GraphQLContext) => {
        return context.loaders.memberType.load(args.id);
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, args, context: GraphQLContext) => {
        return context.loaders.profile.load(args.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, args, context: GraphQLContext) => {
        return context.loaders.post.load(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context: GraphQLContext) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, args, context: GraphQLContext) => {
        return context.loaders.user.load(args.id);
      },
    },
  }),
});
