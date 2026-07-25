import type { ReactNode } from "react";
import {
  XMdIcon,
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
} from "../../assets/icons";
import type { Plan } from "../common/PlanCard";
import { formatDate, formatTime } from "../../utils/dateFormat";

interface ScheduleDetailModalProps {
  date: Date;
  plan: Plan;
  detail?: string;
  onBack: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[4px] bg-gray-30 px-1 py-px text-caption-3 text-gray-400">
      {children}
    </span>
  );
}

function DetailSection({ text }: { text: string }) {
  type Block = { header: string; items: string[] };

  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\[.+\]$/.test(line)) {
      current = { header: line, items: [] };
      blocks.push(current);
    } else if (current) {
      current.items.push(line);
    }
  }

  return (
    <>
      {blocks.map((block, bi) => (
        <div key={bi} className={bi > 0 ? "mt-7" : ""}>
          <p className="text-caption-1 text-gray-700">{block.header}</p>
          <div className="mt-[6px] flex flex-col gap-1">
            {block.items.map((item, ii) => (
              <p key={ii} className="text-caption-2 text-gray-500">
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default function ScheduleDetailModal({
  date,
  plan,
  detail,
  onBack,
  onClose,
  onEdit,
  onDelete,
}: ScheduleDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[343px] rounded-2xl bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between pl-3 pr-4 py-[14px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={onBack}
              className="text-gray-500"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <p className="text-title-2 text-gray-900">
              {date.getMonth() + 1}월 {date.getDate()}일 일정
            </p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="text-gray-900"
          >
            <XMdIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 본문 - gray-30 배경 */}
        <div className="rounded-b-2xl bg-gray-30 px-4 pt-4 pb-4">
          {/* 일정 카드 */}
          <div className="flex items-center rounded-[6px] bg-white py-[10px] pl-4 pr-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
            <div className="ml-3 flex flex-1 flex-col">
              <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <Chip>{formatDate(plan.startDate)}</Chip>
                <Chip>{formatTime(plan.startTime)}</Chip>
                <span className="h-px w-1 shrink-0 bg-gray-500" />
                <Chip>{formatDate(plan.endDate)}</Chip>
                <Chip>{formatTime(plan.endTime)}</Chip>
              </div>
            </div>
          </div>

          {/* 상세 내용 */}
          {detail && (
            <div className="mt-6">
              <DetailSection text={detail} />
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={onEdit}
              className="flex h-[68px] flex-1 flex-col items-center justify-center rounded-xl bg-white"
            >
              <PencilIcon className="h-6 w-6 text-gray-500" />
              <p className="mt-1 text-subtitle-1 text-gray-900">일정 수정</p>
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex h-[68px] flex-1 flex-col items-center justify-center rounded-xl bg-white"
            >
              <TrashIcon className="h-6 w-6 text-warning-400" />
              <p className="mt-1 text-subtitle-1 text-gray-900">일정 삭제</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
