import EmptyView from "../common/EmptyView";
import { HeartEmptyIcon } from "../../assets/icons";

interface UsedLikedEmptyViewProps {
  onGoHome: () => void;
}

export default function UsedLikedEmptyView({ onGoHome }: UsedLikedEmptyViewProps) {
  return (
    <EmptyView
      icon={
        <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
          <HeartEmptyIcon className="h-8 w-8 text-gray-200" />
        </div>
      }
      title="아직 관심 물품이 없어요."
      description="필요한 집기나 재고를 저장해보세요."
      actionLabel="중고거래 홈으로"
      onAction={onGoHome}
    />
  );
}
