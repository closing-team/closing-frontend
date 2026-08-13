import { useCallback, useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

export interface TimeValue {
  meridiem: "오전" | "오후";
  hour: number;
  minute: number;
}

interface TimeWheelProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  className?: string;
}

const ITEM_HEIGHT = 32;
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const MERIDIEMS: TimeValue["meridiem"][] = ["오전", "오후"];

// 드래그로 인식할 최소 이동 거리(px). 이보다 적게 움직이면 클릭으로 취급
const DRAG_THRESHOLD = 4;

function WheelColumn<T extends string | number>({
  items,
  selected,
  onSelect,
  format = String,
}: {
  items: readonly T[];
  selected: T;
  onSelect: (item: T) => void;
  format?: (item: T) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const draggingRef = useRef(false);
  const draggedRef = useRef(false);
  const startYRef = useRef(0);
  const startScrollTopRef = useRef(0);

  useEffect(() => {
    const index = items.indexOf(selected);
    ref.current?.scrollTo({ top: index * ITEM_HEIGHT });
  }, []);

  const snapToNearest = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const index = Math.min(
      items.length - 1,
      Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT)),
    );
    el.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" });
    if (items[index] !== selected) onSelect(items[index]);
  }, [items, selected, onSelect]);

  const handleScroll = () => {
    if (draggingRef.current) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(snapToNearest, 100);
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    draggedRef.current = false;
    startYRef.current = e.clientY;
    startScrollTopRef.current = ref.current?.scrollTop ?? 0;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current || !ref.current) return;
      const deltaY = e.clientY - startYRef.current;
      if (Math.abs(deltaY) > DRAG_THRESHOLD) draggedRef.current = true;
      ref.current.scrollTop = startScrollTopRef.current - deltaY;
    };
    const handleMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      snapToNearest();
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [snapToNearest]);

  const handleSelect = (item: T) => {
    if (draggedRef.current) return;
    const index = items.indexOf(item);
    ref.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" });
    if (item !== selected) onSelect(item);
  };

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      onMouseDown={handleMouseDown}
      className="h-40 snap-y snap-mandatory overflow-y-auto py-[64px] active:cursor-grabbing"
      style={{ scrollbarWidth: "none", cursor: "grab", userSelect: "none" }}
    >
      {items.map((item) => (
        <button
          key={String(item)}
          type="button"
          onClick={() => handleSelect(item)}
          className={`flex h-8 w-14 snap-center items-center justify-center text-body-1 ${
            item === selected ? "font-semibold text-gray-900" : "text-gray-400"
          }`}
        >
          {format(item)}
        </button>
      ))}
    </div>
  );
}

export default function TimeWheel({
  value,
  onChange,
  className = "",
}: TimeWheelProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-white px-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-gray-100" />
      <div className="relative z-10 flex items-center">
        <WheelColumn
          items={HOURS}
          selected={value.hour}
          onSelect={(hour) => onChange({ ...value, hour })}
        />
        <span className="w-4 text-center text-body-1 font-semibold text-gray-900">
          :
        </span>
        <WheelColumn
          items={MINUTES}
          selected={value.minute}
          onSelect={(minute) => onChange({ ...value, minute })}
          format={(m) => String(m).padStart(2, "0")}
        />
        <WheelColumn
          items={MERIDIEMS}
          selected={value.meridiem}
          onSelect={(meridiem) => onChange({ ...value, meridiem })}
          format={(m) => (m === "오전" ? "AM" : "PM")}
        />
      </div>
    </div>
  );
}
