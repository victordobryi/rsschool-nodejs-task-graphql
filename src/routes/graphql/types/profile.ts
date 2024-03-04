import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType, MemberTypeIdType } from './memberType.js';
import { GraphQLContext } from './app.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: async (parent, args, context: GraphQLContext) => {
        return context.prisma.user.findUnique({ where: { id: parent.userId } });
      },
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async ({ memberTypeId }, _args, context: GraphQLContext) => {
        return context.prisma.memberType.findUnique({ where: { id: memberTypeId } });
      },
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeIdType),
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeIdType),
    },
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberTypeId: {
      type: MemberTypeIdType,
    },
  }),
});
