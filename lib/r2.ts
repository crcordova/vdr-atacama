import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "./env";

// Singleton — re-use across requests to avoid per-call TCP/TLS handshake.
let _client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

export async function getObjectStream(key: string): Promise<{
  body: ReadableStream<Uint8Array> | NodeJS.ReadableStream;
  contentType: string | undefined;
  contentLength: number | undefined;
}> {
  const client = getR2Client();
  const res = await client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
    }),
  );
  if (!res.Body) {
    // Do not include the key in the error message — never leak document keys to logs.
    throw new Error("Empty body from R2 object");
  }
  // In Node runtime, AWS SDK returns a Node Readable. The union allows the
  // Edge-runtime case (no SDK on Edge — see notes in route file).
  return {
    body: res.Body as ReadableStream<Uint8Array> | NodeJS.ReadableStream,
    contentType: res.ContentType,
    contentLength: res.ContentLength,
  };
}
