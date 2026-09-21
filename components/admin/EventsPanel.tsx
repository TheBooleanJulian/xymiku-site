"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { driveThumbUrl } from "@/lib/luxsync";

type EventRow = {
  id: string;
  name: string;
  event_date: string;
  status: "online" | "processing" | "archived";
  drive_folder_id: string;
  cover_drive_file_id: string | null;
  external_url: string | null;
  cover_position: "top" | "center" | "bottom";
  image_count_override: number | null;
};

const BLANK: EventRow = {
  id: "",
  name: "",
  event_date: "",
  status: "online",
  drive_folder_id: "",
  cover_drive_file_id: "",
  external_url: "",
  cover_position: "center",
  image_count_override: null,
};

const input =
  "w-full border border-cyan/30 bg-black px-2 py-1.5 font-technical text-xs text-ink focus:border-cyan focus:outline-none";

// Shows what the cover crop actually looks like — the dropdown alone is
// just words, this renders the real photo with that object-position applied.
function CropPreview({ fileId, position }: { fileId: string; position: "top" | "center" | "bottom" }) {
  if (!fileId) {
    return (
      <p className="mt-1 max-w-[7rem] font-technical text-[9px] leading-tight text-mute">
        set a cover file id to preview
      </p>
    );
  }
  const positionClass =
    position === "top" ? "object-top" : position === "bottom" ? "object-bottom" : "object-center";
  return (
    <div className="relative mt-1 h-16 w-24 overflow-hidden border border-cyan/20 bg-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={driveThumbUrl(fileId)}
        alt="Cover crop preview"
        className={`h-full w-full object-cover ${positionClass}`}
      />
    </div>
  );
}

export function EventsPanel() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventRow>(BLANK);
  const [creating, setCreating] = useState<EventRow>(BLANK);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("events")
      .select("id,name,event_date,status,drive_folder_id,cover_drive_file_id,external_url,cover_position,image_count_override")
      .order("event_date", { ascending: false });
    if (error) setError(error.message);
    else setRows(data as EventRow[]);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,name,event_date,status,drive_folder_id,cover_drive_file_id,external_url,cover_position,image_count_override")
        .order("event_date", { ascending: false });
      if (error) setError(error.message);
      else setRows(data as EventRow[]);
      setLoading(false);
    })();
  }, []);

  function startEdit(row: EventRow) {
    setEditingId(row.id);
    setDraft({
      ...row,
      cover_drive_file_id: row.cover_drive_file_id ?? "",
      external_url: row.external_url ?? "",
      image_count_override: row.image_count_override,
    });
  }

  async function saveEdit() {
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("events")
      .update({
        name: draft.name,
        event_date: draft.event_date,
        status: draft.status,
        drive_folder_id: draft.drive_folder_id || null,
        cover_drive_file_id: draft.cover_drive_file_id || null,
        external_url: draft.external_url || null,
        cover_position: draft.cover_position,
        image_count_override: draft.image_count_override,
      })
      .eq("id", editingId);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm(`Delete event "${id}"? This cannot be undone.`)) return;
    setError(null);
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("events").insert({
      id: creating.id,
      name: creating.name,
      event_date: creating.event_date,
      status: creating.status,
      drive_folder_id: creating.drive_folder_id || null,
      cover_drive_file_id: creating.cover_drive_file_id || null,
      external_url: creating.external_url || null,
      cover_position: creating.cover_position,
      image_count_override: creating.image_count_override,
    });
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
        onSubmit={createEvent}
        className="mb-6 grid grid-cols-2 gap-2 border border-cyan/15 bg-deep/40 p-4 sm:grid-cols-3"
      >
        <p className="col-span-2 font-technical text-[10px] tracking-[0.15em] text-cyan sm:col-span-3">
          ADD EVENT
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
          placeholder="name"
          required
          value={creating.name}
          onChange={(e) => setCreating({ ...creating, name: e.target.value })}
        />
        <input
          className={input}
          type="date"
          required
          value={creating.event_date}
          onChange={(e) => setCreating({ ...creating, event_date: e.target.value })}
        />
        <select
          className={input}
          value={creating.status}
          onChange={(e) =>
            setCreating({ ...creating, status: e.target.value as EventRow["status"] })
          }
        >
          <option value="online">online</option>
          <option value="processing">processing</option>
          <option value="archived">archived</option>
        </select>
        <input
          className={input}
          placeholder="drive_folder_id (optional if not organized yet)"
          value={creating.drive_folder_id}
          onChange={(e) => setCreating({ ...creating, drive_folder_id: e.target.value })}
        />
        <input
          className={input}
          placeholder="cover_drive_file_id (optional)"
          value={creating.cover_drive_file_id ?? ""}
          onChange={(e) => setCreating({ ...creating, cover_drive_file_id: e.target.value })}
        />
        <input
          className={input}
          placeholder="external_url (used until drive_folder_id is set)"
          value={creating.external_url ?? ""}
          onChange={(e) => setCreating({ ...creating, external_url: e.target.value })}
        />
        <div>
          <select
            className={input}
            value={creating.cover_position}
            onChange={(e) =>
              setCreating({ ...creating, cover_position: e.target.value as EventRow["cover_position"] })
            }
          >
            <option value="center">cover crop: center</option>
            <option value="top">cover crop: top</option>
            <option value="bottom">cover crop: bottom</option>
          </select>
          <CropPreview fileId={creating.cover_drive_file_id ?? ""} position={creating.cover_position} />
        </div>
        <input
          className={input}
          type="number"
          placeholder="image_count_override (only for events with no Drive folder)"
          value={creating.image_count_override ?? ""}
          onChange={(e) =>
            setCreating({
              ...creating,
              image_count_override: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
        <button
          type="submit"
          disabled={saving}
          className="col-span-2 border border-cyan bg-cyan px-4 py-1.5 font-display text-xs font-bold tracking-[0.1em] text-black disabled:opacity-50 sm:col-span-3"
        >
          {saving ? "SAVING..." : "ADD"}
        </button>
      </form>

      {loading ? (
        <p className="font-technical text-xs text-mute">LOADING...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse font-technical text-xs">
            <colgroup>
              <col className="w-[9%]" />
              <col className="w-[13%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
              <col className="w-[7%]" />
              <col className="w-[11%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-cyan/15 text-left text-mute">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Drive folder</th>
                <th className="p-2">Cover file</th>
                <th className="p-2">External URL</th>
                <th className="p-2">Crop</th>
                <th className="p-2"># override</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) =>
                editingId === row.id ? (
                  <tr key={row.id} className="border-b border-cyan/10">
                    <td className="truncate p-2 text-mute">{row.id}</td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        type="date"
                        value={draft.event_date}
                        onChange={(e) => setDraft({ ...draft, event_date: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className={input}
                        value={draft.status}
                        onChange={(e) =>
                          setDraft({ ...draft, status: e.target.value as EventRow["status"] })
                        }
                      >
                        <option value="online">online</option>
                        <option value="processing">processing</option>
                        <option value="archived">archived</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.drive_folder_id}
                        onChange={(e) =>
                          setDraft({ ...draft, drive_folder_id: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.cover_drive_file_id ?? ""}
                        onChange={(e) =>
                          setDraft({ ...draft, cover_drive_file_id: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.external_url ?? ""}
                        onChange={(e) => setDraft({ ...draft, external_url: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className={input}
                        value={draft.cover_position}
                        onChange={(e) =>
                          setDraft({ ...draft, cover_position: e.target.value as EventRow["cover_position"] })
                        }
                      >
                        <option value="center">center</option>
                        <option value="top">top</option>
                        <option value="bottom">bottom</option>
                      </select>
                      <CropPreview
                        fileId={draft.cover_drive_file_id ?? ""}
                        position={draft.cover_position}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        type="number"
                        value={draft.image_count_override ?? ""}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            image_count_override: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                      />
                    </td>
                    <td className="whitespace-nowrap p-2">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="mr-2 text-cyan hover:underline"
                      >
                        SAVE
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-mute hover:underline">
                        CANCEL
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-cyan/10">
                    <td className="truncate p-2 text-mute">{row.id}</td>
                    <td className="truncate p-2 text-ink">{row.name}</td>
                    <td className="truncate p-2 text-mute">{row.event_date}</td>
                    <td className="truncate p-2 text-mute">{row.status}</td>
                    <td className="truncate p-2 text-mute">{row.drive_folder_id || "—"}</td>
                    <td className="truncate p-2 text-mute">{row.cover_drive_file_id ?? "—"}</td>
                    <td className="truncate p-2 text-mute">{row.external_url ?? "—"}</td>
                    <td className="truncate p-2 text-mute">{row.cover_position}</td>
                    <td className="truncate p-2 text-mute">{row.image_count_override ?? "—"}</td>
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
