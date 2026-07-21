import type { ReactNode } from "react";
import { LightbulbIcon } from "../../assets/icons";

interface TipBoxProps {
  children?: ReactNode;
}

export default function TipBox({ children }: TipBoxProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 pb-4 pt-3.5 shadow-[0_1px_5px_0_rgba(0,0,0,0.03)]">
      <LightbulbIcon className="h-6 w-6 shrink-0 text-primary-500" />
      <div className="flex flex-col gap-1">
        <p className="text-caption-1 text-primary-500">TIP</p>
        <div className="text-body-2 text-gray-700">{children}</div>
      </div>
    </div>
  );
}
