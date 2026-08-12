import { XMdIcon } from "../../assets/icons";

interface ChatImageLightboxProps {
  src: string;
  onClose: () => void;
}

export default function ChatImageLightbox({ src, onClose }: ChatImageLightboxProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0"
      />
      <img
        src={src}
        alt="채팅 이미지 원본"
        className="relative max-h-[90vh] max-w-[90vw] object-contain"
      />
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white"
      >
        <XMdIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
