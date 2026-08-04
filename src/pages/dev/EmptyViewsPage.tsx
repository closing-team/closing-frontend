import type { ReactNode } from "react";
import EmptyView from "../../components/common/EmptyView";
import UsedEmptyView from "../../components/used/UsedEmptyView";
import UsedLikedEmptyView from "../../components/used/UsedLikedEmptyView";
import SearchEmptyView from "../../components/used/SearchEmptyView";
import ChatEmptyView from "../../components/chat/ChatEmptyView";
import ChatRoomEmptyView from "../../components/chat/ChatRoomEmptyView";
import {
  FileSearchIcon,
  BookmarkEmptyIcon,
} from "../../assets/icons";

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-gray-100 pb-6">
      <p className="mb-3 px-4 text-caption-1 text-gray-400">{label}</p>
      <div className="bg-white">{children}</div>
    </section>
  );
}

export default function EmptyViewsPage() {
  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-30 py-6">
      <h1 className="px-4 text-title-2 text-gray-900">EmptyView 모음</h1>

      <Section label="나의 판매물품이 없을 때 (UsedEmptyView)">
        <UsedEmptyView onWrite={() => {}} />
      </Section>

      <Section label="관심물품이 없을 때 (UsedLikedEmptyView)">
        <UsedLikedEmptyView onGoHome={() => {}} />
      </Section>

      <Section label="중고거래 검색결과 없을 때 (SearchEmptyView)">
        <SearchEmptyView query="시모넬리 커피머신" />
      </Section>

      <Section label="채팅이 없을 때 (ChatEmptyView)">
        <ChatEmptyView />
      </Section>

      <Section label="구매 문의 시작 (ChatRoomEmptyView)">
        <ChatRoomEmptyView partnerNickname="클로저 123" />
      </Section>

      <Section label="지원정보 공고가 없을 때">
        <EmptyView
          icon={
            <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
              <FileSearchIcon className="h-8 w-8 text-gray-200" />
            </div>
          }
          title="현재 진행 중인 폐업지원 공고가 없어요"
          description="새로운 공고가 등록되면 이곳에서 확인할 수 있어요."
        />
      </Section>

      <Section label="북마크한 지원정보 없을 때">
        <EmptyView
          icon={
            <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
              <BookmarkEmptyIcon className="h-8 w-8 text-gray-200" />
            </div>
          }
          title="아직 저장한 공고가 없어요"
          description="관심 있는 공고를 저장하면 이곳에서 모아볼 수 있어요."
          actionLabel="공고 보러가기"
          onAction={() => {}}
        />
      </Section>
    </div>
  );
}
