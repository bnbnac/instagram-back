import { deleteFromS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(
      async (_, { id }, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
            file: true,
          },
        });
        if (!photo) {
          return {
            ok: false,
            error: "Photo not found",
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "not authorized",
          };
        } else {
          await client.photo.delete({
            where: {
              id,
            },
          });
          await deleteFromS3(photo.file);
          return {
            ok: true,
          };
        }
      }
    ),
  },
};

export default resolvers;
