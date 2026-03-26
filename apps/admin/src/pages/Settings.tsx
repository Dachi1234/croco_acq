import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

const inputClass =
  "bg-[#0a2a36] border border-[#072c38] text-white rounded-lg px-3 py-2 w-full max-w-xl focus:border-[#189541] focus:outline-none";

const labelClass = "block text-sm text-white/80 mb-1";

type SettingsResponse = {
  registration_url?: string | null;
  site_name?: string | null;
  default_og_image?: string | null;
};

export default function Settings() {
  const api = useApi();
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [defaultOgImage, setDefaultOgImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get<SettingsResponse>("/api/settings")
      .then((data) => {
        setRegistrationUrl(data.registration_url ?? "");
        setSiteName(data.site_name ?? "");
        setDefaultOgImage(data.default_og_image ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveOk(false);
    try {
      await api.patch<SettingsResponse>("/api/settings", {
        registration_url: registrationUrl,
        site_name: siteName,
        default_og_image: defaultOgImage,
      });
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {saveOk ? <p className="text-sm text-[#26c159]">Saved.</p> : null}

      <div className="space-y-6 rounded-xl border border-[#072c38] bg-[#00131a]/50 p-6">
        <div>
          <label className={labelClass} htmlFor="registration_url">
            Registration URL
          </label>
          <input
            id="registration_url"
            type="url"
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
            className={inputClass}
            placeholder="https://…"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="site_name">
            Site name
          </label>
          <input
            id="site_name"
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="default_og_image">
            Default OG image
          </label>
          <input
            id="default_og_image"
            type="text"
            value={defaultOgImage}
            onChange={(e) => setDefaultOgImage(e.target.value)}
            className={inputClass}
            placeholder="Image URL"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
        className="rounded-lg bg-[#189541] px-6 py-2.5 font-medium text-white hover:bg-[#26c159] disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
