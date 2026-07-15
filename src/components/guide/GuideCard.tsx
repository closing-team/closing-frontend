import Button from "../common/Button";
import { CheckIcon } from "../../assets/icons";

export interface GuidePoint {
  header: string;
  details: string[];
  buttonLabel?: string;
  onButtonClick?: () => void;
}

interface GuideCardProps {
  title: string;
  points: GuidePoint[];
}

export default function GuideCard({ title, points }: GuideCardProps) {
  return (
    <div className="flex w-full flex-col items-start rounded-xl bg-white p-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)]">
      <div className="flex items-center gap-0.5">
        <CheckIcon className="h-6 w-6 shrink-0 text-primary-500" />
        <p className="text-title-3 text-gray-900">{title}</p>
      </div>
      {points.map((point, i) => (
        <div
          key={i}
          className={`flex w-full flex-col items-start gap-1 ${
            i > 0 && points[i - 1].buttonLabel ? "mt-4" : "mt-3"
          }`}
        >
          <div className="flex items-center gap-1">
            <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-gray-900" />
            <p className="text-subtitle-2 text-gray-900">{point.header}</p>
          </div>
          <div className="flex flex-col gap-0.5">
            {point.details.map((detail, j) => (
              <div key={j} className="flex items-start gap-2">
                <span className="mt-2 h-px w-[3px] shrink-0 rounded-full bg-gray-500" />
                <p className="text-body-3 text-gray-500">{detail}</p>
              </div>
            ))}
          </div>
          {point.buttonLabel && (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={point.onButtonClick}
              className="mt-3 text-primary-500"
            >
              {point.buttonLabel}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
