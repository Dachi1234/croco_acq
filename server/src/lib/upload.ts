import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3001";

export async function saveFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<{ filename: string; url: string; sizeBytes: number }> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(originalName);
  const filename = `${nanoid(16)}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(filePath, buffer);

  return {
    filename,
    url: `${PUBLIC_URL}/uploads/${filename}`,
    sizeBytes: buffer.length,
  };
}
