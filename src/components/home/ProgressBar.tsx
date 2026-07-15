interface ProgressBarProps {
  value: number;
  className?: string;
}

export default function ProgressBar({
  value,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <div
        className="h-full rounded-full bg-primary-500 transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
