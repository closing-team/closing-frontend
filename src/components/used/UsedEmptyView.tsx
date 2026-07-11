interface UsedEmptyViewProps {
  onWrite: () => void;
}

// 상품 없음 — 엠티 뷰 + 글쓰기 버튼 (MKT001)
export default function UsedEmptyView({ onWrite }: UsedEmptyViewProps) {
  return (
    <div className="flex flex-col items-center px-8 pt-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-bg-100 text-bg-200">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path d="M4.25 3.19C3.25 4.02 2.98 5.43 2.45 8.25L1.55 13.08C0.8 17.05 0.43 19.03 1.52 20.34C2.6 21.65 4.62 21.65 8.66 21.65H15.34C19.38 21.65 21.4 21.65 22.48 20.34C23.57 19.03 23.2 17.05 22.45 13.08L21.55 8.25C21.02 5.43 20.75 4.02 19.75 3.19C18.74 2.35 17.31 2.35 14.44 2.35H9.56C6.69 2.35 5.26 2.35 4.25 3.19Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 7C8.5 8.93 10.07 10.5 12 10.5C13.93 10.5 15.5 8.93 15.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-base font-semibold text-gray-900">아직 등록된 상품이 없어요</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        가게 집기와 재고를 첫 번째로 등록해 보세요.
      </p>
      <button
        type="button"
        onClick={onWrite}
        className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white active:opacity-90"
      >
        글쓰기
      </button>
    </div>
  );
}