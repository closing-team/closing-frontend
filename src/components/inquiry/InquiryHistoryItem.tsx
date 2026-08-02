import { ChevronDownIcon, ChevronUpIcon } from "../../assets/icons";
import { formatDate } from "../../utils/dateFormat";
import type { InquiryListItem } from "../../types/inquiryApi";

interface InquiryHistoryItemProps {
  inquiry: InquiryListItem;
  expanded: boolean;
  onToggle: () => void;
}

function StatusChip({ status }: { status: InquiryListItem["status"] }) {
  const answered = status === "answered";
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-caption-1 ${
        answered ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400"
      }`}
    >
      {answered ? "답변 완료" : "답변 대기"}
    </span>
  );
}

export default function InquiryHistoryItem({
  inquiry,
  expanded,
  onToggle,
}: InquiryHistoryItemProps) {
  return (
    <div className="w-full px-4">
      <div className="flex w-full flex-col border-b border-gray-100 pb-7">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full flex-col gap-4 text-left"
        >
          <div className="flex items-center justify-between">
            <StatusChip status={inquiry.status} />
            <span className="flex h-7 w-7 items-center justify-center text-gray-900">
              {expanded ? (
                <ChevronUpIcon className="h-6 w-6" />
              ) : (
                <ChevronDownIcon className="h-6 w-6" />
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1 px-0.5">
            <p
              className={`text-title-3 text-gray-900 ${expanded ? "" : "truncate"}`}
            >
              {inquiry.title}
            </p>
            {inquiry.content && (
              <p
                className={`text-body-2 text-gray-900 ${
                  expanded ? "whitespace-pre-line" : "truncate"
                }`}
              >
                {inquiry.content}
              </p>
            )}
          </div>
        </button>

        {inquiry.status === "answered" &&
          inquiry.imageUrls &&
          inquiry.imageUrls.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {inquiry.imageUrls.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt=""
                  className="size-[70px] shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

        <p className="mt-3 text-caption-2 text-gray-500">
          {formatDate(new Date(inquiry.createdAt))}
        </p>

        {expanded && inquiry.answer && (
          <div className="mt-3 flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-lg bg-gray-30 p-4">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-caption-1 text-white">
                A
              </div>
              <p className="flex-1 whitespace-pre-line text-body-2 text-gray-900">
                {inquiry.answer}
              </p>
            </div>
            {inquiry.answeredAt && (
              <p className="text-caption-2 text-gray-500">
                {formatDate(new Date(inquiry.answeredAt))}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
