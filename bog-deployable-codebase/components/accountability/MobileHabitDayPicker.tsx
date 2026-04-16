'use client';

import { useMemo, useState } from 'react';

type MobileHabitDayPickerProps = {
  rowIndex: number;
  initialCheckedDays: number[];
  disabled: boolean;
  daysInTracker?: number;
};

export default function MobileHabitDayPicker({
  rowIndex,
  initialCheckedDays,
  disabled,
  daysInTracker = 31,
}: MobileHabitDayPickerProps) {
  const initialSet = useMemo(
    () => new Set(initialCheckedDays),
    [initialCheckedDays]
  );

  const [selectedDays, setSelectedDays] = useState<Set<number>>(initialSet);

  function toggleDay(day: number) {
    if (disabled) return;

    setSelectedDays((prev) => {
      const next = new Set(prev);

      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }

      return next;
    });
  }

  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Track Days
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInTracker }, (_, dayIndex) => {
          const day = dayIndex + 1;
          const checked = selectedDays.has(day);

          return (
            <div key={day}>
              <input
                type="checkbox"
                name={`habit_${rowIndex}_day_${day}`}
                checked={checked}
                readOnly
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => toggleDay(day)}
                disabled={disabled}
                aria-pressed={checked}
                className={`flex h-11 w-full items-center justify-center rounded-xl border text-xs font-semibold transition ${
                  checked
                    ? 'border-red-500/40 bg-red-500/12 text-white'
                    : 'border-white/10 bg-black/30 text-zinc-400'
                } ${
                  disabled
                    ? 'opacity-60'
                    : 'hover:border-white/20 hover:text-white active:scale-[0.98]'
                }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}