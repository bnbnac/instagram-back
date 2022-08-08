import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Comment: {
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
  },
};

export default resolvers;
