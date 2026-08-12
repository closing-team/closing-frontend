import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../common/TopBar";
import Checkbox from "../common/Checkbox";
import { ROUTES } from "../../constants/routes";

interface StepLayoutProps {
  isFromAI: boolean;
  paddingBottom?: string;
  title: string;
  subtitle: string;
  description: string;
  descriptionClassName?: string;
  agreed: boolean;
  onAgreedChange: (checked: boolean) => void;
  checkboxLabel: string;
  footer: ReactNode;
  children: ReactNode;
}

export default function StepLayout({
  isFromAI,
  paddingBottom = "pb-44",
  title,
  subtitle,
  description,
  descriptionClassName = "mt-1 whitespace-pre-line text-body-2 text-gray-700",
  agreed,
  onAgreedChange,
  checkboxLabel,
  footer,
  children,
}: StepLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className={`min-h-dvh bg-white ${paddingBottom}`}>
      <TopBar
        title={title}
        onBack={() =>
          navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)
        }
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{subtitle}</p>
        <p className={descriptionClassName}>{description}</p>
      </div>

      {children}

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={onAgreedChange}
            label={<span className="text-body-2 text-gray-900">{checkboxLabel}</span>}
          />
        </div>
        {footer}
      </div>
    </div>
  );
}
