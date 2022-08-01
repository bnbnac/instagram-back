import { chownSync, createWriteStream } from "fs";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import client from "../../client";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    // avatar is a promise contains a filename and a function named createReadStream
    // createReadStream has a function named pipe
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }

  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
      // spread operator
    },
  });
  if (updatedUser.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "Could not update profile" };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
  Upload: GraphQLUpload,
};
