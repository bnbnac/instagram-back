import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser, client }) => {
        let room = null;
        if (userId) {
          const user = await client.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              id: true,
            },
          });
          if (!user) {
            return {
              ok: false,
              error: "user not exist",
            };
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  {
                    id: loggedInUser.id,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });
          if (!room) {
            return {
              ok: false,
              error: "room not found",
            };
          }
        }
        const newMessage = await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: room.id,
              },
              // we can skip "connect" with using connector(?) directly...
              // so it is equals to
              // data:{
              // roomId:room.id,
              // userId:loggedInUser.id,
              // }
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });

        pubsub.publish(NEW_MESSAGE, { roomUpdates: newMessage });

        return {
          ok: true,
          id: newMessage.id,
        };
      }
    ),
  },
};

export default resolvers;
