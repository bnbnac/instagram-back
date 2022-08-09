import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "jinstagram-uploads",
      Key: objName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};

export const deleteFromS3 = async (fileUrl) => {
  const decodedUrl = decodeURI(fileUrl);
  // better way to split????
  const fileName = decodedUrl.split("jinstagram-uploads.s3.amazonaws.com/")[1];
  await new AWS.S3()
    .deleteObject({
      Bucket: "jinstagram-uploads",
      Key: fileName,
    })
    .promise();
};
