import { FileSearchIcon } from "../../assets/icons";

interface SearchEmptyViewProps {
  query: string;
}

export default function SearchEmptyView({ query }: SearchEmptyViewProps) {
  return (
    <div className="flex flex-col items-center gap-3 pt-10">
      <div className="flex h-20 w-20 items-center justify-center rounded-[20px]">
        <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
          <FileSearchIcon className="h-8 w-8 text-gray-200" />
        </div>
      </div>
      <p className="text-body-2">
        <span className="text-gray-900">'{query}'</span>
        <span className="text-gray-500"> 검색 결과가 없어요.</span>
      </p>
    </div>
  );
}
