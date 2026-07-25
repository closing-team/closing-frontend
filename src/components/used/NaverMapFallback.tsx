import { MarkerIcon } from "../../assets/icons";

interface NaverMapFallbackProps {
  className?: string;
}

export default function NaverMapFallback({
  className = "",
}: NaverMapFallbackProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gray-100 text-primary-500 ${className}`}
    >
      <MarkerIcon className="h-8 w-8" />
    </div>
  );
}
