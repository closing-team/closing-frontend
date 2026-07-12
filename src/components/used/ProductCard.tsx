import HeartIcon from '../../assets/icons/heart.svg?react';
import type { Product } from '../../types/used';

interface ProductCardProps {
  product: Product;
  onClick: (id: number) => void;
  onToggleLike: (id: number) => void;
}

// 상품 카드 (2열 그리드) — 클릭 시 상품 상세(MKT002)로 이동
export default function ProductCard({ product, onClick, onToggleLike }: ProductCardProps) {
  const meta = [...product.dealTypes, `${formatDistance(product.distanceM)}`, product.neighborhood, product.timeAgo].join(' · ');

  return (
    <button type="button" onClick={() => onClick(product.id)} className="flex flex-col text-left active:opacity-80">
      {/* 썸네일 + 찜 버튼 */}
      <div className="relative w-full overflow-hidden rounded-xl bg-bg-100" style={{ aspectRatio: '1 / 1' }}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          // TODO: (MKT001) 실제 상품 이미지 연동 전 플레이스홀더
          <div className="flex h-full w-full items-center justify-center text-bg-200">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="9" r="1.5" fill="currentColor" />
              <path d="M4 17L9 12L13 15L16 13L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        <span
          role="button"
          tabIndex={0}
          aria-label={product.liked ? '찜 해제' : '찜하기'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(product.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onToggleLike(product.id);
            }
          }}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <HeartIcon
            width={20}
            height={20}
            className={product.liked ? 'fill-primary text-primary' : 'fill-none text-gray-400'}
          />
        </span>
      </div>

      {/* 상품명 (최대 2줄) */}
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-gray-900">{product.title}</p>

      {/* 메타: 거래방식 · 거리 · 동네 · 시간 */}
      <p className="mt-1 truncate text-xs font-normal text-gray-400">{meta}</p>

      {/* 가격 */}
      <p className="mt-1 text-base font-bold text-gray-900">{formatPrice(product.price)}원</p>
    </button>
  );
}

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

function formatDistance(distanceM: number) {
  if (distanceM < 1000) return `${distanceM}m`;
  return `${(distanceM / 1000).toFixed(1)}km`;
}
