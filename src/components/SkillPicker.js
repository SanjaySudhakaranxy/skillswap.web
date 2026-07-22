"use client";

import { useState } from "react";

export default function SkillPicker({ label, hint, value, onChange, max = 5 }) {
  const [text, setText] = useState("");

  function add() {
    const skill = text.trim().toLowerCase();
    if (!skill) return;
    if (value.length >= max) return;
    if (value.includes(skill)) {
      setText("");
      return;
    }
    onChange([...value, skill]);
    setText("");
  }

  function remove(skill) {
    onChange(value.filter((s) => s !== skill));
  }

  return (
    <div>
      <label className="label">
        {label} <span className="text-slate-600">({value.length}/{max})</span>
      </label>
      <div className="flex gap-2">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={hint}
          disabled={value.length >= max}
        />
        <button onClick={add} disabled={value.length >= max} className="btn-ghost">
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((s) => (
            <span key={s} className="chip">
              {s}
              <button onClick={() => remove(s)} className="text-slate-400 hover:text-red-400">
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
