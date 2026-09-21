"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CharacterRow = {
  id: string;
  name: string;
  designation: string;
  href: string;
  cover_drive_file_id: string | null;
};

const BLANK: CharacterRow = {
  id: "",
  name: "",
  designation: "",
  href: "#",
  cover_drive_file_id: "",
};

const input =
  "w-full border border-cyan/30 bg-black px-2 py-1.5 font-technical text-xs text-ink focus:border-cyan focus:outline-none";

export function CharactersPanel() {
  const [rows, setRows] = useState<CharacterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CharacterRow>(BLANK);
  const [creating, setCreating] = useState<CharacterRow>(BLANK);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("characters")
      .select("id,name,designation,href,cover_drive_file_id")
      .order("name", { ascending: true });
    if (error) setError(error.message);
    else setRows(data as CharacterRow[]);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("id,name,designation,href,cover_drive_file_id")
        .order("name", { ascending: true });
      if (error) setError(error.message);
      else setRows(data as CharacterRow[]);
      setLoading(false);
    })();
  }, []);

  function startEdit(row: CharacterRow) {
    setEditingId(row.id);
    setDraft({ ...row, cover_drive_file_id: row.cover_drive_file_id ?? "" });
  }

  async function saveEdit() {
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("characters")
      .update({
        name: draft.name,
        designation: draft.designation,
        href: draft.href,
        cover_drive_file_id: draft.cover_drive_file_id || null,
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
    if (!window.confirm(`Delete character "${id}"?`)) return;
    setError(null);
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  }

  async function createRow(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.from("characters").insert({
      id: creating.id,
      name: creating.name,
      designation: creating.designation,
      href: creating.href || "#",
      cover_drive_file_id: creating.cover_drive_file_id || null,
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
        onSubmit={createRow}
        className="mb-6 grid grid-cols-2 gap-2 border border-cyan/15 bg-deep/40 p-4 sm:grid-cols-3"
      >
        <p className="col-span-2 font-technical text-[10px] tracking-[0.15em] text-cyan sm:col-span-3">
          ADD CHARACTER
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
          placeholder="designation (e.g. V01)"
          required
          value={creating.designation}
          onChange={(e) => setCreating({ ...creating, designation: e.target.value })}
        />
        <input
          className={input}
          placeholder="href (default #)"
          value={creating.href}
          onChange={(e) => setCreating({ ...creating, href: e.target.value })}
        />
        <input
          className={input}
          placeholder="cover_drive_file_id (optional)"
          value={creating.cover_drive_file_id ?? ""}
          onChange={(e) => setCreating({ ...creating, cover_drive_file_id: e.target.value })}
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
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[18%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-cyan/15 text-left text-mute">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Designation</th>
                <th className="p-2">Href</th>
                <th className="p-2">Cover file</th>
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
                        value={draft.designation}
                        onChange={(e) => setDraft({ ...draft, designation: e.target.value })}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        className={input}
                        value={draft.href}
                        onChange={(e) => setDraft({ ...draft, href: e.target.value })}
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
                    <td className="whitespace-nowrap p-2">
                      <button onClick={saveEdit} disabled={saving} className="mr-2 text-cyan hover:underline">
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
                    <td className="truncate p-2 text-mute">{row.designation}</td>
                    <td className="truncate p-2 text-mute">{row.href}</td>
                    <td className="truncate p-2 text-mute">{row.cover_drive_file_id ?? "—"}</td>
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
