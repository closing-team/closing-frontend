import Button from "../common/Button";

interface BusinessAuthModalProps {
  onClose: () => void;
  onVerify: () => void;
}

export default function BusinessAuthModal({
  onClose,
  onVerify,
}: BusinessAuthModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative w-full max-w-xs rounded-2xl bg-white px-6 pb-5 pt-7">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L20 5.5V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V5.5L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 11.5L11.2 13.7L15.2 9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-center text-title-3 text-gray-900">
          사업자 인증이 필요해요
        </h2>
        <p className="mt-2 text-center text-body-2 text-gray-500">
          중고거래 글을 등록하려면
          <br />
          사업자 인증을 먼저 완료해 주세요.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {/* TODO: (MKT001) 실제 사업자 인증 플로우 연동 */}
          <Button fullWidth onClick={onVerify}>
            사업자 인증하기
          </Button>
          <Button fullWidth variant="text" onClick={onClose}>
            다음에 할게요
          </Button>
        </div>
      </div>
    </div>
  );
}
