import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const comment = await client.comment.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
          },
        });
        if (!comment) {
          return {
            ok: false,
            error: "comment not found",
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "not auth",
          };
        } else {
          await client.comment.delete({
            where: {
              id,
            },
          });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};

export default resolvers;
