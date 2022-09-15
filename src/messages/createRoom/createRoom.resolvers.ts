import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    createRoom: protectedResolver(async (_, { userId }, { loggedInUser }) => {
      if (userId < 1) {
        return {
          ok: false,
          error: "userId should be a natural number",
        };
      }

      const room = await client.room.findMany({
        where: {
          AND: [
            {
              users: {
                some: {
                  id: userId,
                },
              },
            },
            {
              users: {
                some: {
                  id: loggedInUser.id,
                },
              },
            },
          ],
        },
      });

      if (room[0]) {
        return {
          ok: true,
          id: room[0].id,
        };
      } else {
        const createdRoom = await client.room.create({
          data: {
            users: {
              connect: [
                {
                  id: loggedInUser.id,
                },
                {
                  id: userId,
                },
              ],
            },
          },
        });
        return {
          ok: true,
          id: createdRoom.id,
        };
      }
    }),
  },
};

export default resolvers;
