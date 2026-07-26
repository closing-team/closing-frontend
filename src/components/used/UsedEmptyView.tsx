import Button from "../common/Button";
import { PackageIcon } from "../../assets/icons";

interface UsedEmptyViewProps {
  onWrite: () => void;
}

export default function UsedEmptyView({ onWrite }: UsedEmptyViewProps) {
  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center">
          <PackageIcon className="h-[50px] w-[54px]" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-title-3 text-gray-700">아직 등록한 물품이 없어요.</p>
          <p className="text-body-2 text-gray-700">
            판매할 집기나 재고를 등록해 정리를 시작해보세요.
          </p>
        </div>
      </div>
      <Button size="lg" onClick={onWrite} className="mt-8 px-5">
        물품 등록
      </Button>
    </div>
  );
}
