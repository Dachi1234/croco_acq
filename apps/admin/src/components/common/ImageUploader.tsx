import { useRef, useState } from "react";

const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full focus:border-[#189541] focus:outline-none";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

function isLikelyImageSrc(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  return (
    /^https?:\/\//i.test(t) ||
    t.startsWith("/") ||
    t.startsWith("data:image/")
  );
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFile = () => fileInputRef.current?.click();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
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
        throw new Error(
          (errBody as { error?: string }).error ?? `Upload failed (${res.status})`,
        );
      }

      const data = (await res.json()) as { url?: string };
      if (!data.url) {
        throw new Error("Upload response missing url");
      }
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label ? (
        <label className="block text-sm text-white/80">{label}</label>
      ) : null}
      {isLikelyImageSrc(value) ? (
        <div className="rounded-lg border border-[#072c38] bg-[#0a2a36] p-2">
          <img
            src={value}
            alt=""
            className="max-h-40 w-auto max-w-full rounded object-contain"
          />
        </div>
      ) : null}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder="Image URL"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <button
        type="button"
        onClick={pickFile}
        disabled={uploading}
        className="rounded-lg border border-[#072c38] bg-[#0a2a36] px-3 py-2 text-sm text-white hover:border-[#189541] disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
