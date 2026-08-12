import { Link } from "react-router-dom";
import { CheckIcon, ChevronRightIcon } from "../../assets/icons";
import { guideDetailPath } from "../../constants/routes";

export interface GuideStep {
  id: number;
  title: string;
  description: string;
}

export function StepCardBody({ step }: { step: GuideStep }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-0.5">
        <CheckIcon className="h-6 w-6 shrink-0 text-primary-500" />
        <p className="text-subtitle-2 font-semibold text-gray-900">
          {step.id}. {step.title}
        </p>
      </div>
      <p className="mt-1 text-body-3 text-gray-700">{step.description}</p>
    </div>
  );
}

interface StepCardProps {
  step: GuideStep;
  isFromAI?: boolean;
}

export default function StepCard({ step, isFromAI }: StepCardProps) {
  return (
    <Link
      to={guideDetailPath(step.id)}
      state={isFromAI ? { from: "ai" } : undefined}
      className="flex items-center rounded-lg bg-white pb-4 pl-4 pr-3 pt-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)] active:opacity-75"
    >
      <StepCardBody step={step} />
      <ChevronRightIcon className="ml-3 h-6 w-6 shrink-0 text-gray-400" />
    </Link>
  );
}
