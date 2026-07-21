interface NoteBoxProps {
  title: string;
  items: string[];
}

export default function NoteBox({ title, items }: NoteBoxProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-5 p-4 shadow-[0_1px_2.5px_0_rgba(0,0,0,0.03)]">
      <p className="text-caption-1 text-gray-900">{title}</p>
      <ul className="flex flex-col gap-0.5 pl-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-1 text-[12px] font-normal leading-[140%] text-gray-500"
          >
            <span aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
