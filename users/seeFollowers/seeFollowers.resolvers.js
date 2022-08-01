import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      const aFollowers = await client.user
        .findUnique({ where: { username } })
        .follower();
      console.log(aFollowers);
    },
  },
};
