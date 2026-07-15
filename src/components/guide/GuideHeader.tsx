interface GuideHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export default function GuideHeader({
  title,
  description,
  className = "",
}: GuideHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 bg-white px-4 py-5 ${className}`}>
      <p className="text-title-3 text-gray-900">{title}</p>
      <p className="text-body-2 text-gray-700">{description}</p>
    </div>
  );
}
