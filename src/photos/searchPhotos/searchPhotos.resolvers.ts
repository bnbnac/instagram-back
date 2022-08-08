import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhotos: (_, { keyword, page }, { client, IN_PAGE }) =>
      client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
        take: IN_PAGE,
        skip: IN_PAGE * (page - 1),
        orderBy: {
          createdAt: "desc",
        },
      }),
  },
};

export default resolvers;
