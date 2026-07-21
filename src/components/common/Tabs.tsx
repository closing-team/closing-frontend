export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  value,
  onChange,
  className = "",
}: TabsProps) {
  return (
    <div className={`flex ${className}`}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex-1 py-3 text-center text-title-3 transition-colors ${
              active
                ? "border-b-2 border-primary-500 bg-primary-50 text-primary-500"
                : "border-b border-gray-100 bg-white text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
