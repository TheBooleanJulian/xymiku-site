"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = "cosplay" | "event" | "portrait" | "conceptual";

type ImageRow = {
  id: string;
  drive_file_id: string;
  category: Category;
  year: number;
  character: string | null;
  cosplayer: string | null;
  event_label: string | null;
  featured: boolean;
  timeline_pick: boolean;
  portfolio_pick: boolean;
};

const BLANK: ImageRow = {
  id: "",
  drive_file_id: "",
  category: "cosplay",
  year: new Date().getFullYear(),
  character: "",
  cosplayer: "",
  event_label: "",
  featured: false,
  timeline_pick: false,
  portfolio_pick: false,
};

const input =
  "w-full border border-cyan/30 bg-black px-2 py-1.5 font-technical text-xs text-ink focus:border-cyan focus:outline-none";

function toRow(r: ImageRow) {
  return {
    drive_file_id: r.drive_file_id,
    category: r.category,
    year: Number(r.year),
    character: r.character || null,
    cosplayer: r.cosplayer || null,
    event_label: r.event_label || null,
    featured: r.featured,
    timeline_pick: r.timeline_pick,
    portfolio_pick: r.portfolio_pick,
  };
}

export function CuratedImagesPanel() {
  const [rows, setRows] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ImageRow>(BLANK);
  const [creating, setCreating] = useState<ImageRow>(BLANK);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("curated_images")
      .select(
        "id,drive_file_id,category,year,character,cosplayer,event_label,featured,timeline_pick,portfolio_pick"
      )
      .order("year", { ascending: false });
    if (error) setError(error.message);
    else setRows(data as ImageRow[]);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("curated_images")
        .select(
          "id,drive_file_id,category,year,character,cosplayer,event_label,featured,timeline_pick,portfolio_pick"
        )
        .order("year", { ascending: false });
      if (error) setError(error.message);
      else setRows(data as ImageRow[]);
      setLoading(false);
    })();
  }, []);

  function startEdit(row: ImageRow) {
    setEditingId(row.id);
    setDraft({ ...row, character: row.character ?? "", cosplayer: row.cosplayer ?? "", event_label: row.event_label ?? "" });
  }

  async function saveEdit() {
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("curated_images").update(toRow(draft)).eq("id", editingId);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm(`Delete curated image "${id}"?`)) return;
    setError(null);
    const { error } = await supabase.from("curated_images").delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  }

  async function createRow(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("curated_images").insert({ id: creating.id, ...toRow(creating) });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setCreating(BLANK);
    load();
  }

  return (
    <div>
      {error && (
        <p className="mb-4 border border-signal/40 bg-signal/10 px-3 py-2 font-technical text-xs text-signal">
          {error}
        </p>
      )}

      <form
        onSubmit={createRow}
        className="mb-6 grid grid-cols-2 gap-2 border border-cyan/15 bg-deep/40 p-4 sm:grid-cols-4"
      >
        <p className="col-span-2 font-technical text-[10px] tracking-[0.15em] text-cyan sm:col-span-4">
          ADD CURATED IMAGE
        </p>
        <input
          className={input}
          placeholder="id (slug)"
          required
          value={creating.id}
          onChange={(e) => setCreating({ ...creating, id: e.target.value })}
        />
        <input
          className={input}
          placeholder="drive_file_id"
          required
          value={creating.drive_file_id}
          onChange={(e) => setCreating({ ...creating, drive_file_id: e.target.value })}
        />
        <select
          className={input}
          value={creating.category}
          onChange={(e) => setCreating({ ...creating, category: e.target.value as Category })}
        >
          <option value="cosplay">cosplay</option>
          <option value="event">event</option>
          <option value="portrait">portrait</option>
          <option value="conceptual">conceptual</option>
        </select>
        <input
          className={input}
          type="number"
          placeholder="year"
          required
          value={creating.year}
          onChange={(e) => setCreating({ ...creating, year: Number(e.target.value) })}
        />
        <input
          className={input}
          placeholder="character"
          value={creating.character ?? ""}
          onChange={(e) => setCreating({ ...creating, character: e.target.value })}
        />
        <input
          className={input}
          placeholder="cosplayer"
          value={creating.cosplayer ?? ""}
          onChange={(e) => setCreating({ ...creating, cosplayer: e.target.value })}
        />
        <input
          className={input}
          placeholder="event_label"
          value={creating.event_label ?? ""}
          onChange={(e) => setCreating({ ...creating, event_label: e.target.value })}
        />
        <div className="flex items-center gap-3 font-technical text-xs text-mute">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={creating.featured}
              onChange={(e) => setCreating({ ...creating, featured: e.target.checked })}
            />
            featured
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={creating.timeline_pick}
              onChange={(e) => setCreating({ ...creating, timeline_pick: e.target.checked })}
            />
            timeline
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={creating.portfolio_pick}
              onChange={(e) => setCreating({ ...creating, portfolio_pick: e.target.checked })}
            />
            portfolio
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="col-span-2 border border-cyan bg-cyan px-4 py-1.5 font-display text-xs font-bold tracking-[0.1em] text-black disabled:opacity-50 sm:col-span-4"
        >
          {saving ? "SAVING..." : "ADD"}
        </button>
      </form>

      {loading ? (
        <p className="font-technical text-xs text-mute">LOADING...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-technical text-xs">
            <thead>
              <tr className="border-b border-cyan/15 text-left text-mute">
                <th className="p-2">ID</th>
                <th className="p-2">Drive file</th>
                <th className="p-2">Category</th>
                <th className="p-2">Year</th>
                <th className="p-2">Character</th>
                <th className="p-2">Cosplayer</th>
                <th className="p-2">Event label</th>
                <th className="p-2">Flags</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                editingId === row.id ? (
                  <tr key={row.id} className="border-b border-cyan/10">
                    <td className="p-2 text-mute">{row.id}</td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.drive_file_id}
                        onChange={(e) => setDraft({ ...draft, drive_file_id: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className={input}
                        value={draft.category}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
                      >
                        <option value="cosplay">cosplay</option>
                        <option value="event">event</option>
                        <option value="portrait">portrait</option>
                        <option value="conceptual">conceptual</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        type="number"
                        value={draft.year}
                        onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.character ?? ""}
                        onChange={(e) => setDraft({ ...draft, character: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.cosplayer ?? ""}
                        onChange={(e) => setDraft({ ...draft, cosplayer: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.event_label ?? ""}
                        onChange={(e) => setDraft({ ...draft, event_label: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex flex-col gap-1 text-mute">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={draft.featured}
                            onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                          />
                          featured
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={draft.timeline_pick}
                            onChange={(e) => setDraft({ ...draft, timeline_pick: e.target.checked })}
                          />
                          timeline
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={draft.portfolio_pick}
                            onChange={(e) => setDraft({ ...draft, portfolio_pick: e.target.checked })}
                          />
                          portfolio
                        </label>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-2 align-top">
                      <button onClick={saveEdit} disabled={saving} className="mr-2 text-cyan hover:underline">
                        SAVE
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-mute hover:underline">
                        CANCEL
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-cyan/10 align-top">
                    <td className="p-2 text-mute">{row.id}</td>
                    <td className="max-w-[160px] truncate p-2 text-mute">{row.drive_file_id}</td>
                    <td className="p-2 text-mute">{row.category}</td>
                    <td className="p-2 text-mute">{row.year}</td>
                    <td className="p-2 text-ink">{row.character ?? "—"}</td>
                    <td className="p-2 text-mute">{row.cosplayer ?? "—"}</td>
                    <td className="p-2 text-mute">{row.event_label ?? "—"}</td>
                    <td className="p-2 text-mute">
                      {[row.featured && "featured", row.timeline_pick && "timeline", row.portfolio_pick && "portfolio"]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <button onClick={() => startEdit(row)} className="mr-2 text-cyan hover:underline">
                        EDIT
                      </button>
                      <button onClick={() => remove(row.id)} className="text-signal hover:underline">
                        DELETE
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
