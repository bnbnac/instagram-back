import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

const resolvers = {
  Subscription: {
    // handling auth err
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (!room) {
          throw new Error("you shall not see this");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          // filterFn has two parameters of its own
          ({ roomUpdates }, { id }) => {
            return roomUpdates.roomId === id;
          }
        )(root, args, context, info);
      },
      //   var withFilter = function (asyncIteratorFn, filterFn) {
      //     return function (rootValue, args, context, info) {
      //         var _a;
      //         var asyncIterator = asyncIteratorFn(rootValue, args, context, info);
      //         var getNextPromise = function () {
      //             return new Promise(function (resolve, reject) {
      //                 var inner = function () {
      //                     asyncIterator
      //                         .next()
      //                         .then(function (payload) {
      //                         if (payload.done === true) {
      //                             resolve(payload);
      //                             return;
      //                         }
      //                         Promise.resolve(filterFn(payload.value, args, context, info))
    },
  },
};

export default resolvers;
