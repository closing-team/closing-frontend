import packageCircle from "../../assets/images/package-circle.png";

interface ChatRoomEmptyViewProps {
  partnerNickname: string;
}

export default function ChatRoomEmptyView({
  partnerNickname,
}: ChatRoomEmptyViewProps) {
  return (
    <div className="flex flex-col items-center gap-3 pt-10">
      <img src={packageCircle} alt="" className="h-[72px] w-[72px]" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-title-3 text-gray-700">{partnerNickname}</p>
        <p className="text-body-3 text-gray-500">
          거래를 시작해보세요.
          <br />
          물품 상태나 거래 일정을 판매자에게 문의할 수 있어요.
        </p>
      </div>
    </div>
  );
}
