export const uploadFileToS3 = async (file: any): Promise<string> => {
  console.log('Mocking S3 upload for file:', file.originalname);
  // Simulate upload and return a mock URL
  return `https://mock-s3-bucket.s3.amazonaws.com/${file.originalname}`;
};
