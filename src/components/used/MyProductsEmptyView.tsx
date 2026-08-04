import EmptyView from "../common/EmptyView";
import { PackageIcon } from "../../assets/icons";

interface MyProductsEmptyViewProps {
  isFiltered: boolean;
  onWrite: () => void;
}

export default function MyProductsEmptyView({
  isFiltered,
  onWrite,
}: MyProductsEmptyViewProps) {
  if (isFiltered) {
    return (
      <EmptyView
        icon={<PackageIcon className="h-[50px] w-[54px]" />}
        title="해당하는 상품이 없어요."
      />
    );
  }

  return (
    <EmptyView
      icon={<PackageIcon className="h-[50px] w-[54px]" />}
      title="아직 등록한 물품이 없어요."
      description="판매할 집기나 재고를 등록해 정리를 시작해보세요."
      actionLabel="물품 등록"
      onAction={onWrite}
    />
  );
}
