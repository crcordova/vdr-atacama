import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { findDocument } from "@/lib/catalog";
import { env } from "@/lib/env";
import { getObjectStream } from "@/lib/r2";

// Run in Node runtime — the AWS SDK and R2 streaming require Node APIs.
export const runtime = "nodejs";
// Prevent Next.js from caching the route handler output.
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Auth gate — cookie must be present and valid.
  if (!(await isAuthenticated())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Catalog lookup — only ids registered in catalog.ts are downloadable.
  const { id } = await params;
  const doc = findDocument(id);
  if (!doc) {
    return new NextResponse("Not found", { status: 404 });
  }

  // 3. Resolve the R2 object key from the env var named by the catalog entry.
  const key = env[doc.envKey as keyof typeof env];
  if (!key || typeof key !== "string") {
    // Log the slug (public URL token), never the key.
    console.error(`[download] Missing env var for document ${doc.id}`);
    return new NextResponse("Misconfigured", { status: 500 });
  }

  // 4. Stream the PDF from R2 and forward it to the client.
  try {
    const { body, contentLength } = await getObjectStream(key);

    // In Node runtime the AWS SDK Body is a Node Readable. NextResponse's
    // TypeScript types target the Web BodyInit, so we cast through the union
    // we declared in r2.ts. Next.js forwards Node Readables to the
    // underlying web response without buffering (chunks flow as they arrive).
    const stream = body as NodeJS.ReadableStream;

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Cache-Control": "private, no-store",
    });
    if (contentLength) {
      headers.set("Content-Length", String(contentLength));
    }

    // @ts-expect-error — Node Readable passes through NextResponse in Node runtime.
    return new NextResponse(stream, { status: 200, headers });
  } catch (err) {
    // Log the error for ops; do not include the document key in the message.
    console.error("[download] R2 fetch failed:", err);
    return new NextResponse("Upstream error", { status: 502 });
  }
}
