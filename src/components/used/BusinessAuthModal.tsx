interface BusinessAuthModalProps {
  onClose: () => void;
  onVerify: () => void; // 사업자 인증 완료
}

// 사업자 인증 모달 (MKT001) — 미인증 사용자가 글쓰기(FAB/글쓰기) 진입 시 1회 노출
export default function BusinessAuthModal({ onClose, onVerify }: BusinessAuthModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-8">
      {/* 딤 배경 */}
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/40" />

      {/* 모달 본문 */}
      <div className="relative w-full max-w-xs rounded-2xl bg-white px-6 pb-5 pt-7">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L20 5.5V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V5.5L12 2Z" stroke="#6558FF" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 11.5L11.2 13.7L15.2 9.5" stroke="#6558FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-center text-base font-bold text-gray-900">사업자 인증이 필요해요</h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
          중고거래 글을 등록하려면
          <br />
          사업자 인증을 먼저 완료해 주세요.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {/* TODO: (MKT001) 실제 사업자 인증 플로우 연동 */}
          <button
            type="button"
            onClick={onVerify}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white active:opacity-90"
          >
            사업자 인증하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-gray-400"
          >
            다음에 할게요
          </button>
        </div>
      </div>
    </div>
  );
}
