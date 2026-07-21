import type { ReactNode } from "react";

interface FabBaseProps {
  icon: ReactNode;
  onClick?: () => void;
  noNavBar?: boolean;
}

type FabProps =
  | (FabBaseProps & { variant: "llm"; label: string })
  | (FabBaseProps & { variant: "used"; ariaLabel: string });

const VARIANT_CLASS = {
  llm: "flex h-12 w-[140px] items-center justify-center gap-1 rounded-[50px] bg-primary-500 pb-3 pl-4 pr-[18px] pt-3 text-title-3 text-white shadow-xl active:opacity-90",
  used: "flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 p-3 shadow-xl active:opacity-90",
} as const;

export default function Fab({ icon, onClick, noNavBar = false, ...rest }: FabProps) {
  const isLlm = rest.variant === "llm";

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 ${noNavBar ? "bottom-6" : "bottom-26"} z-40 mx-auto flex w-full max-w-app min-w-[var(--container-app-min)] justify-end px-4 [&>button]:pointer-events-auto`}
    >
      <button
        type="button"
        aria-label={isLlm ? rest.label : rest.ariaLabel}
        onClick={onClick}
        className={VARIANT_CLASS[rest.variant]}
      >
        {icon}
        {isLlm && rest.label}
      </button>
    </div>
  );
}
