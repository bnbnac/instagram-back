import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: (_, { id, page }, { client, IN_PAGE }) =>
      client.comment.findMany({
        where: {
          id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: IN_PAGE,
        skip: IN_PAGE * (page - 1),
      }),
  },
};

export default resolvers;
