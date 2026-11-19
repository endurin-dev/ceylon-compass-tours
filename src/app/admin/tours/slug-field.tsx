"use client";

import { useEffect, useRef, useState } from "react";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function SlugField({ titleId = "title" }: { titleId?: string }) {
  const [value, setValue] = useState("");
  const touched = useRef(false);

  useEffect(() => {
    const el = document.getElementById(titleId) as HTMLInputElement | null;
    if (!el) return;
    const onInput = () => {
      if (!touched.current) setValue(slugify(el.value));
    };
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [titleId]);

  return (
    <div className="ta-addon">
      <span>/tours/</span>
      <input
        id="slug"
        name="slug"
        required
        className="ta-input"
        value={value}
        placeholder="colombo-caves-kandy"
        onChange={(e) => {
          touched.current = true;
          setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
        }}
        onBlur={() => setValue((v) => v.replace(/^-+|-+$/g, ""))}
      />
    </div>
  );
}