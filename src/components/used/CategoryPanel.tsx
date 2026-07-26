import { useState } from "react";
import Category from "./Category";
import {
  INDUSTRY_CATEGORIES,
  ITEM_CATEGORIES,
} from "../../constants/usedCategories";

type CategoryTab = "industry" | "item";

const TABS: { key: CategoryTab; label: string }[] = [
  { key: "industry", label: "업종별 분류" },
  { key: "item", label: "품목별 분류" },
];

interface CategoryPanelProps {
  onSelect: (type: CategoryTab, label: string) => void;
}

export default function CategoryPanel({ onSelect }: CategoryPanelProps) {
  const [tab, setTab] = useState<CategoryTab>("industry");
  const groups = tab === "industry" ? INDUSTRY_CATEGORIES : ITEM_CATEGORIES;

  return (
    <div className="flex flex-1 border-t border-gray-100">
      <div className="w-[112px] shrink-0 bg-gray-30">
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`flex w-full items-center gap-2.5 border-l-2 py-4 pl-[18px] pr-[18px] text-left text-subtitle-2 ${
                active
                  ? "border-primary-500 bg-white text-primary-500"
                  : "border-transparent text-gray-900"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-white pb-10 pt-2">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-[18px] py-2 text-caption-1 text-gray-500">
              {group.title}
            </p>
            <div className="grid grid-cols-2 gap-2 px-4">
              {group.items.map((item) => (
                <Category
                  key={item}
                  label={item}
                  onClick={() => onSelect(tab, item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
