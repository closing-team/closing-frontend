export interface BulletItem {
  text: string;
  emphasis?: boolean;
  underline?: boolean;
  href?: string;
}

export interface BulletGroup {
  heading: string;
  headingEmphasis?: boolean;
  items: (string | BulletItem)[];
}

interface BulletListProps {
  groups: BulletGroup[];
}

function normalizeItem(item: string | BulletItem): BulletItem {
  return typeof item === "string" ? { text: item } : item;
}

export default function BulletList({ groups }: BulletListProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {groups.map((group, i) => (
        <div key={i} className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-1">
            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-gray-500" />
            <p
              className={`flex-1 text-subtitle-2 ${
                group.headingEmphasis ? "text-primary-500" : "text-gray-900"
              }`}
            >
              {group.heading}
            </p>
          </div>
          <ul className="flex w-full flex-col gap-0.5">
            {group.items.map((rawItem, j) => {
              const item = normalizeItem(rawItem);
              const colorClass = item.emphasis
                ? "text-primary-500"
                : item.underline || item.href
                  ? "text-gray-700"
                  : "text-gray-500";
              const textClass = `flex-1 text-body-3 ${colorClass} ${
                item.underline || item.href ? "underline" : ""
              }`;

              return (
                <li key={j} className="flex w-full items-start gap-1">
                  <span className="flex shrink-0 items-center pt-2">
                    <span
                      className={`h-px w-[3px] rounded-full ${
                        item.emphasis ? "bg-primary-500" : "bg-gray-500"
                      }`}
                    />
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={textClass}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className={textClass}>{item.text}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
