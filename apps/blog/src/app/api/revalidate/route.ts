import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function getSecret(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Fallback: support query param for backwards compatibility
  return request.nextUrl.searchParams.get("secret");
}

export async function POST(request: NextRequest) {
  const secret = getSecret(request);
  const path = request.nextUrl.searchParams.get("path");

  if (secret !== process.env.BLOG_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
