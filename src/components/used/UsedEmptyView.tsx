import Button from "../common/Button";
import { BagIcon } from "../../assets/icons";

interface UsedEmptyViewProps {
  onWrite: () => void;
}

export default function UsedEmptyView({ onWrite }: UsedEmptyViewProps) {
  return (
    <div className="flex flex-col items-center px-8 pt-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-200">
        <BagIcon className="h-[34px] w-[34px]" />
      </div>
      <p className="text-title-3 text-gray-900">아직 등록된 상품이 없어요</p>
      <p className="mt-2 text-body-2 text-gray-500">
        가게 집기와 재고를 첫 번째로 등록해 보세요.
      </p>
      <Button size="lg" onClick={onWrite} className="mt-6 px-6">
        글쓰기
      </Button>
    </div>
  );
}
