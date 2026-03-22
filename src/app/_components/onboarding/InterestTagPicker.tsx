"use client";

interface InterestTagPickerProps {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  minCount?: number;
  maxCount?: number;
  disabled?: boolean;
  label?: string;
}

export function InterestTagPicker({
  options,
  selected,
  onChange,
  minCount = 3,
  maxCount = 5,
  disabled = false,
  label = "INTERESTS",
}: InterestTagPickerProps) {
  function toggle(tag: string) {
    if (disabled) return;
    const idx = selected.indexOf(tag);
    if (idx >= 0) {
      onChange(selected.filter((_, i) => i !== idx));
    } else if (selected.length < maxCount) {
      onChange([...selected, tag]);
    }
  }

  const count = selected.length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-widest text-white/35">
          {label}
        </span>
        <span className="text-[11px] font-medium text-white/50">
          ({count}/{maxCount})
        </span>
      </div>
      <p className="mb-4 text-[13px] text-white/45">
        Select career interests that you&apos;d like to share with the people
        you connect with. Choose a minimum of {minCount}.
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              disabled={disabled}
              onClick={() => toggle(tag)}
              className={`
                rounded-full px-4 py-2 text-[13px] font-medium transition-all
                duration-150
                ${
                  isSelected
                    ? "border-2 border-rose-500 bg-white/5 text-rose-400"
                    : "border border-white/20 bg-white/[0.04] text-white/70 hover:border-white/30 hover:bg-white/[0.06] hover:text-white/85"
                }
                disabled:pointer-events-none disabled:opacity-50
              `}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
