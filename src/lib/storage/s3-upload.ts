import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { ServerLogger } from "../logging/server-logger";

const logger = ServerLogger;

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadFileToS3(
  file: File,
  fileName: string,
  bucketName: string,
): Promise<string> {
  try {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_S3_BUCKET_NAME ||
      !process.env.AWS_S3_REGION
    ) {
      logger.warn(
        "Credenciales de AWS S3 no configuradas. No se realizará la carga a S3.",
      );
      throw new Error("Credenciales de AWS S3 no configuradas.");
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      logger.info(
        `Progreso de carga de S3: ${progress.loaded}/${progress.total}`,
      );
    });

    const data = await upload.done();
    const fileUrl = (data as any).Location;
    logger.info(`Archivo ${fileName} cargado a S3: ${fileUrl}`);
    return fileUrl;
  } catch (error: unknown) {
    logger.error(
      `Error al cargar el archivo a S3: ${error instanceof Error ? error.message : "Error desconocido"}`,
    );
    throw error;
  }
}
