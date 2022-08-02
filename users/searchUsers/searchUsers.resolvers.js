import client from "../../client";

export default {
  Query: {
    searchUsers: (_, { keyword, lastId }, { IN_PAGE }) =>
      client.user.findMany({
        where: {
          username: {
            mode: "insensitive",
            startsWith: keyword, //.toLowerCase(),
          },
        },
        take: IN_PAGE,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
  // MAKE pagination!!!  // AND user done commit
};
