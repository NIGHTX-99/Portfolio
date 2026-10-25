"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { SiteConfig } from "@/lib/site-types";

export default function AdminPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [status, setStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/site");
    if (res.ok) setConfig(await res.json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!config) return;
    setStatus("Saving…");
    const res = await fetch("/api/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setStatus(res.ok ? "Saved." : "Save failed.");
  };

  const resetReveal = () => {
    if (!config) return;
    setConfig({
      ...config,
      hero: { ...config.hero, revealSeed: config.hero.revealSeed + 1 },
    });
    setStatus("Reveal reset — click Save to apply on the home page.");
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !config) return;
    setUploading(true);
    setStatus("Uploading…");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const { path } = (await res.json()) as { path: string };
      setConfig({ ...config, hero: { ...config.hero, backgroundImage: path } });
      setStatus("Image uploaded — click Save.");
    } else {
      setStatus("Upload failed.");
    }
  };

  if (!config) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-100 text-zinc-600">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This admin page has <strong>no authentication</strong>. Do not deploy publicly without
          adding auth (e.g. <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> on
          the API route).
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Site admin</h1>
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
            ← Home
          </Link>
        </div>

        <form
          className="space-y-8 rounded-2xl bg-white p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-800">Hero text</h2>
            <label className="block text-sm text-zinc-600">
              Greeting
              <input
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={config.hero.greeting}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, greeting: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm text-zinc-600">
              Name line 1
              <input
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={config.hero.nameLine1}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, nameLine1: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm text-zinc-600">
              Name line 2
              <input
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={config.hero.nameLine2}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, nameLine2: e.target.value },
                  })
                }
              />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-800">Background image</h2>
            <p className="text-sm text-zinc-500">Current: {config.hero.backgroundImage}</p>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => void onUpload(e)}
              className="block text-sm"
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-800">Contact</h2>
            <label className="block text-sm text-zinc-600">
              Email
              <input
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={config.contact.email}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, email: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm text-zinc-600">
              CV URL
              <input
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={config.contact.cvUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    contact: { ...config.contact, cvUrl: e.target.value },
                  })
                }
              />
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-zinc-800">Social links</h2>
            {(["github", "instagram", "linkedin"] as const).map((key) => (
              <label key={key} className="block text-sm capitalize text-zinc-600">
                {key}
                <input
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                  value={config.social[key]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      social: { ...config.social, [key]: e.target.value },
                    })
                  }
                />
              </label>
            ))}
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={resetReveal}
              className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Reset scratch reveal
            </button>
          </div>

          {status && <p className="text-sm text-zinc-600">{status}</p>}
        </form>
      </div>
    </div>
  );
}
