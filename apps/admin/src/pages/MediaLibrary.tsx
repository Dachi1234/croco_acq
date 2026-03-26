import { useEffect, useRef, useState } from "react";
import { useApi } from "@/hooks/useApi";

type UploadItem = {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
};

function resolvePublicUrl(pathOrUrl: string): string {
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export default function MediaLibrary() {
  const api = useApi();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyFlashId, setCopyFlashId] = useState<string | null>(null);

  const loadUploads = () =>
    api
      .get<UploadItem[]>("/api/uploads")
      .then(setUploads)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load uploads"));

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadUploads().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount load only
  }, []);

  const uploadFile = async (file: File | null) => {
    if (!file) return;
    const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
    const endpoint = `${base}/api/uploads`;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(endpoint, {
        method: "POST",
        body,
        credentials: "include",
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as { error?: string }).error ?? `Upload failed (${res.status})`);
      }
      await loadUploads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    void uploadFile(file ?? null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    void uploadFile(file ?? null);
  };

  const copyUrl = async (item: UploadItem) => {
    const full = resolvePublicUrl(item.url);
    try {
      await navigator.clipboard.writeText(full);
      setCopyFlashId(item.id);
      setTimeout(() => setCopyFlashId(null), 1500);
    } catch {
      setError("Could not copy to clipboard");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Media library</h1>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <section
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
        className="rounded-xl border border-dashed border-[#072c38] bg-[#00131a] px-6 py-10 text-center"
      >
        <p className="text-white/80 mb-4">
          Drag files here or choose a file to upload to <code className="text-[#26c159]">/api/uploads</code>
        </p>
        <input ref={fileRef} type="file" className="hidden" onChange={onInputChange} />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="rounded-lg bg-[#189541] px-5 py-2.5 font-medium text-white hover:bg-[#26c159] disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Choose file"}
        </button>
      </section>

      {loading ? (
        <p className="text-gray-400">Loading uploads…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {uploads.map((item) => {
            const fullUrl = resolvePublicUrl(item.url);
            const showThumb = isImageMime(item.mime_type);
            return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-lg border border-[#072c38] bg-[#00131a]"
              >
                <div className="aspect-video w-full bg-[#0a2a36] flex items-center justify-center overflow-hidden">
                  {showThumb ? (
                    <img
                      src={fullUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-white/40" aria-hidden>
                      📄
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <p className="text-xs text-white/90 truncate" title={item.original_name}>
                    {item.original_name || item.filename}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyUrl(item)}
                    className="mt-auto rounded-lg border border-[#072c38] bg-[#0a2a36] px-3 py-2 text-sm text-white hover:border-[#189541]"
                  >
                    {copyFlashId === item.id ? "Copied" : "Copy URL"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && uploads.length === 0 ? (
        <p className="text-sm text-gray-500">No uploads yet.</p>
      ) : null}
    </div>
  );
}
