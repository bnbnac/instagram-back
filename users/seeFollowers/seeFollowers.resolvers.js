import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      const IN_PAGE = 5;
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
      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: IN_PAGE,
          skip: IN_PAGE * (page - 1),
        });
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
