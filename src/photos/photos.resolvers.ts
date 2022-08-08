import { Resolvers } from "../types";

// cf) how the parent looks like
// {
//     id: 1,
//     userId: 4,
//     file: 'd',
//     caption: 'OMG I love this #food beacause #avocado is my #favorite.',
//     updatedAt: 2022-08-05T00:32:08.299Z,
//     createdAt: 2022-08-05T00:32:08.298Z
// }

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) =>
      client.user.findUnique({ where: { id: userId } }),
    likes: ({ id }, _, { client }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),

    hashtags: ({ id }, _, { client }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
  },
  Hashtag: {
    photos: ({ id }, { page }, { client, IN_PAGE }) => {
      return client.hashtag.findUnique({ where: { id } }).photos({
        take: IN_PAGE,
        skip: IN_PAGE * (page - 1),
      });
    },
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
