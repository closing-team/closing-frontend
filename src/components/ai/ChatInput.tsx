import { SendEnabledIcon } from "../../assets/icons";
import cloyCircle from "../../assets/images/cloy-circle.png";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  helper?: string;
  className?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "현재 폐업 상황을 알려주세요...",
  helper = "클로이와 맞춤 일정 생성하기",
  className = "",
}: ChatInputProps) {
  const canSend = value.trim().length > 0;

  return (
    <div className={`rounded-2xl bg-white p-4 shadow-md ${className}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && canSend) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={placeholder}
        rows={2}
        className="w-full resize-none text-body-2 text-gray-900 outline-none placeholder:text-gray-400"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <img src={cloyCircle} alt="" className="h-6 w-6 shrink-0 rounded-full" />
          <span className="text-caption-1 text-gray-500">{helper}</span>
        </span>
        <button
          type="button"
          aria-label="전송"
          disabled={!canSend}
          onClick={onSend}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors ${
            canSend ? "bg-primary-500 active:opacity-90" : "bg-gray-200"
          }`}
        >
          <SendEnabledIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
