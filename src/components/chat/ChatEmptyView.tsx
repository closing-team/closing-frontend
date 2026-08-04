import EmptyView from "../common/EmptyView";
import { MessageIcon } from "../../assets/icons";

export default function ChatEmptyView() {
  return (
    <EmptyView
      icon={
        <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
          <MessageIcon className="h-8 w-8 text-gray-200" />
        </div>
      }
      title="아직 채팅이 없어요."
    />
  );
}
