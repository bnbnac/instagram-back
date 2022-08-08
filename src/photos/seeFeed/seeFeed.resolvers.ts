import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(
      (_, { page }, { loggedInUser, client, IN_PAGE }) =>
        client.photo.findMany({
          where: {
            OR: [
              {
                user: {
                  followers: {
                    some: {
                      id: loggedInUser.id,
                    },
                  },
                },
              },
              {
                userId: loggedInUser.id,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
          take: IN_PAGE,
          skip: IN_PAGE * (page - 1),
        })
    ),
  },
};

export default resolvers;
