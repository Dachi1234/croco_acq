const BLOG_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3003";
const REVALIDATE_SECRET = process.env.BLOG_REVALIDATE_SECRET || "change-me-in-production";

export async function revalidatePath(path: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `${BLOG_URL}/api/revalidate?secret=${REVALIDATE_SECRET}&path=${encodeURIComponent(path)}`,
      { signal: controller.signal },
    );
    clearTimeout(timer);
    return res.ok;
  } catch (err) {
    console.error(`Failed to revalidate path ${path}:`, err);
    return false;
  }
}
