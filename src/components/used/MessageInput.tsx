import { useState } from "react";
import { PlusMdIcon, SendEnabledIcon } from "../../assets/icons";

interface MessageInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  placeholder = "메시지를 입력하세요...",
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white px-4 pb-6 pt-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="첨부"
          className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400"
        >
          <PlusMdIcon className="h-6 w-6" />
        </button>
        <div className="flex h-10 flex-1 items-center rounded-full bg-gray-30 px-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={placeholder}
            className="w-full min-w-0 bg-transparent text-body-2 text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          type="button"
          aria-label="전송"
          onClick={submit}
          disabled={!canSend}
          className={`flex h-8 w-8 shrink-0 items-center justify-center ${
            canSend ? "text-primary-500" : "text-gray-200"
          }`}
        >
          <SendEnabledIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
