import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { IN_PAGE, client }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "user not found",
        };
      }
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: IN_PAGE,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
      return {
        ok: true,
        following,
      };
    },
  },
};

export default resolvers;
