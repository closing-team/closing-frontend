import { StepCardBody } from "./StepCard";
import type { GuideStep } from "./StepCard";

interface StepSummaryProps {
  step: GuideStep;
}

export default function StepSummary({ step }: StepSummaryProps) {
  return (
    <div className="flex items-center rounded-lg bg-white pb-4 pl-4 pr-3 pt-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)]">
      <StepCardBody step={step} />
    </div>
  );
}
