import supportEmptyIllustration from "../../assets/images/support-empty.png";

interface SupportEmptyViewProps {
  title: string;
  description: string;
}

export default function SupportEmptyView({
  title,
  description,
}: SupportEmptyViewProps) {
  return (
    <div className="flex flex-col items-center px-8 pt-20 text-center">
      <img
        src={supportEmptyIllustration}
        alt=""
        className="mb-5 h-20 w-20 object-contain"
      />
      <p className="text-title-3 text-gray-900">{title}</p>
      <p className="mt-2 text-body-2 text-gray-500">{description}</p>
    </div>
  );
}
