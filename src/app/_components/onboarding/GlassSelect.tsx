"use client";

import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface GlassSelectProps {
  id: string;
  label: string;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function GlassSelect({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
}: GlassSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={ref} className="relative" style={{ zIndex: open ? 40 : 1 }}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-white/35"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-[13px] outline-none transition-all duration-150 disabled:opacity-40 ${
          open
            ? "border-violet-400/20 bg-white/[0.07] shadow-[0_0_0_3px_rgba(139,92,246,0.06)]"
            : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.06]"
        }`}
      >
        <span className={value ? "text-white/85" : "text-white/25"}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`h-3.5 w-3.5 text-white/20 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 overflow-hidden rounded-lg border border-white/[0.1] bg-[#14141a]/95 shadow-[0_12px_40px_rgb(0_0_0/0.5),0_0_0_1px_rgba(139,92,246,0.04)] backdrop-blur-xl">
          {options.length > 5 && (
            <div className="border-b border-white/[0.05] px-2 py-1.5">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent px-2 py-1.5 text-[13px] text-white/80 placeholder:text-white/20 outline-none"
              />
            </div>
          )}

          <div className="max-h-52 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-center text-[13px] text-white/20">
                No results
              </div>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => handleSelect(o.value)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition-colors duration-75 ${
                    o.value === value
                      ? "bg-white/[0.08] text-white"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  {o.label}
                  {o.value === value && (
                    <svg
                      className="h-3.5 w-3.5 text-white/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
