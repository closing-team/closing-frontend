interface CategoryProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function Category({ label, onClick, className = "" }: CategoryProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2.5 rounded-md bg-primary-50 p-3 text-center text-body-3 text-gray-900 active:bg-primary-100 ${className}`}
    >
      {label}
    </button>
  );
}
