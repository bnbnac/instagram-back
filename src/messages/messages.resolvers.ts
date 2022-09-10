import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id }, _, { client }) =>
      client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }, _, { client }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    unreadTotal: ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      // note that ))) type Room { unreadTotal }
      return client.message.count({
        where: {
          read: false, // then, what is the read?
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }, _, { client }) =>
      client.message.findUnique({ where: { id } }).user(),
    // user: async ({ id }, _, { client }) => {
    //   const result = await client.message.findUnique({ where: { id } }).user();
    //   return result;
    // },
  },
};

export default resolvers;
