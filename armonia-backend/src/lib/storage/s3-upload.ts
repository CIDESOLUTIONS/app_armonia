import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadFileToS3 = async (file: any): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || 'your-s3-bucket-name';
  const key = `uploads/${Date.now()}-${file.originalname}`;

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    console.log('File uploaded to S3:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

export const deleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || 'your-s3-bucket-name';
  const urlParts = fileUrl.split('/');
  const key = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    console.log(`File deleted from S3: ${fileUrl}`);
  } catch (error) {
    console.error(`Error deleting file from S3: ${fileUrl}`, error);
    throw error;
  }
};
