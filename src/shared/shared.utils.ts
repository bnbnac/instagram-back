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
  console.log(fileUrl);
  const decodedUrl = decodeURI(fileUrl);
  const fileName = decodedUrl.split("amazonaws.com/")[1];
  console.log(fileName);
  await new AWS.S3()
    .deleteObject({
      Bucket: "jinstagram-uploads",
      Key: fileName,
    })
    .promise();
};
