import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../../lib/s3";
import { NextResponse } from "next/server";
import mime from "mime-types";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    const urls = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const newFilename =
        Date.now() + "-" + Math.random().toString(36).substring(2) + "." + ext;

      const buffer = await file.arrayBuffer();
      const fileData = Buffer.from(buffer);

      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: newFilename,
            Body: fileData,
            ACL: "public-read",
            ContentType: mime.lookup(file.name) || "application/octet-stream",
          })
        );

        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFilename}`;
        urls.push(url);
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        throw uploadError;
      }
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
