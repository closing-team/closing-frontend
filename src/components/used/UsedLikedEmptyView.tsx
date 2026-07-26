import Button from "../common/Button";
import { HeartEmptyIcon } from "../../assets/icons";

interface UsedLikedEmptyViewProps {
  onGoHome: () => void;
}

export default function UsedLikedEmptyView({ onGoHome }: UsedLikedEmptyViewProps) {
  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center">
          <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
            <HeartEmptyIcon className="h-8 w-8 text-gray-200" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-title-3 text-gray-700">아직 관심 물품이 없어요.</p>
          <p className="text-body-2 text-gray-700">
            필요한 집기나 재고를 저장해보세요.
          </p>
        </div>
      </div>
      <Button size="lg" onClick={onGoHome} className="mt-8 px-5">
        중고거래 홈으로
      </Button>
    </div>
  );
}
