import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export function createLoaders(prisma: PrismaClient) {
  return {
    user: new DataLoader(async (userIds: readonly string[]) => {
      const relatedUsers = await prisma.user.findMany({
        where: {
          id: {
            in: [...userIds],
          },
        },
      });
      const users = {};
      relatedUsers.forEach((u) => (users[u.id] = u));
      return userIds.map((userId) => users[userId] ?? null);
    }),
    profile: new DataLoader(async (profileIds: readonly string[]) => {
      const relatedProfiles = await prisma.profile.findMany({
        where: {
          id: {
            in: [...profileIds],
          },
        },
      });
      const profiles = {};
      relatedProfiles.forEach((p) => (profiles[p.id] = p));
      return profileIds.map((profileId) => profiles[profileId] ?? null);
    }),
    post: new DataLoader(async (postIds: readonly string[]) => {
      const relatedPosts = await prisma.post.findMany({
        where: {
          id: {
            in: [...postIds],
          },
        },
      });
      const posts = {};
      relatedPosts.forEach((p) => (posts[p.id] = p));
      return postIds.map((postId) => posts[postId] ?? null);
    }),
    memberType: new DataLoader(async (memberTypeIds: readonly string[]) => {
      const relatedMemberTypes = await prisma.memberType.findMany({
        where: {
          id: {
            in: [...memberTypeIds],
          },
        },
      });
      const memberTypes = {};
      relatedMemberTypes.forEach((m) => (memberTypes[m.id] = m));
      return memberTypeIds.map((memberTypeId) => memberTypes[memberTypeId]);
    }),
    profileByUser: new DataLoader(async (usersIds: readonly string[]) => {
      const relatedProfiles = await prisma.profile.findMany({
        where: {
          userId: {
            in: [...usersIds],
          },
        },
      });
      const profiles = {};
      relatedProfiles.forEach((p) => (profiles[p.userId] = p));
      return usersIds.map((userId) => profiles[userId] ?? null);
    }),
    postsByUser: new DataLoader(async (usersIds: readonly string[]) => {
      const relatedPosts = await prisma.post.findMany({
        where: {
          authorId: {
            in: [...usersIds],
          },
        },
      });
      const posts = {};
      relatedPosts.forEach((p) =>
        posts[p.authorId] ? posts[p.authorId].push(p) : (posts[p.authorId] = [p]),
      );
      return usersIds.map((userId) => posts[userId] ?? []);
    }),
    profilesByMemberType: new DataLoader(async (memberTypesIds: readonly string[]) => {
      const relatedProfiles = await prisma.profile.findMany({
        where: {
          memberTypeId: {
            in: [...memberTypesIds],
          },
        },
      });
      const profiles = {};
      relatedProfiles.forEach((p) =>
        profiles[p.memberTypeId]
          ? profiles[p.memberTypeId].push(p)
          : (profiles[p.memberTypeId] = [p]),
      );
      return memberTypesIds.map((memberTypeId) => profiles[memberTypeId] ?? []);
    }),
    userSubscribedTo: new DataLoader(async (subscribersIds: readonly string[]) => {
      const relatedUsers = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: {
                in: [...subscribersIds],
              },
            },
          },
        },
        include: {
          subscribedToUser: {
            select: {
              subscriberId: true,
            },
          },
        },
      });
      return subscribersIds.map((subscriberId) => {
        return relatedUsers.filter((user) => {
          return user.subscribedToUser.some((sub) => sub.subscriberId === subscriberId);
        });
      });
    }),
    subscribedToUser: new DataLoader(async (authorsIds: readonly string[]) => {
      const relatedUsers = await prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: {
                in: [...authorsIds],
              },
            },
          },
        },
        include: {
          userSubscribedTo: {
            select: {
              authorId: true,
            },
          },
        },
      });
      return authorsIds.map((authorId) => {
        return relatedUsers.filter((user) => {
          return user.userSubscribedTo.some((sub) => sub.authorId === authorId);
        });
      });
    }),
  };
}
