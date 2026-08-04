import EmptyView from "../common/EmptyView";
import { FileSearchIcon } from "../../assets/icons";

interface SearchEmptyViewProps {
  query: string;
}

export default function SearchEmptyView({ query }: SearchEmptyViewProps) {
  return (
    <EmptyView
      paddingTop="pt-10"
      icon={
        <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
          <FileSearchIcon className="h-8 w-8 text-gray-200" />
        </div>
      }
      titleClassName="text-body-2"
      title={
        <>
          <span className="text-gray-900">'{query}'</span>
          <span className="text-gray-500"> 검색 결과가 없어요.</span>
        </>
      }
    />
  );
}
