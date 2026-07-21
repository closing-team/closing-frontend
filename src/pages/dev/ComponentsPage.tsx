import { useState } from "react";
import type { ReactNode } from "react";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import ProgressBar from "../../components/home/ProgressBar";
import TextField from "../../components/common/TextField";
import TextArea from "../../components/common/TextArea";
import Checkbox from "../../components/common/Checkbox";
import Radio from "../../components/used/Radio";
import SelectField from "../../components/common/SelectField";
import VerifyField from "../../components/sidemenu/VerifyField";
import type { VerifyStatus } from "../../components/sidemenu/VerifyField";
import PriceField from "../../components/used/PriceField";
import Chip from "../../components/common/Chip";
import TopBar from "../../components/common/TopBar";
import Tabs from "../../components/common/Tabs";
import Dropdown from "../../components/common/Dropdown";
import SearchBar from "../../components/used/SearchBar";
import Callout, { CalloutItem } from "../../components/common/Callout";
import CalloutBanner from "../../components/common/CalloutBanner";
import ChatBubble from "../../components/common/ChatBubble";
import ChatInput from "../../components/ai/ChatInput";
import DateCalendar from "../../components/common/DateCalendar";
import TimeWheel from "../../components/common/TimeWheel";
import type { TimeValue } from "../../components/common/TimeWheel";
import DateField from "../../components/common/DateField";
import TimeField from "../../components/common/TimeField";
import ScheduleRangeField from "../../components/common/ScheduleRangeField";
import { getNextHour, toTimeValue, addHours } from "../../utils/dateFormat";
import Fab from "../../components/common/Fab";
import NavigationBar from "../../components/common/NavigationBar";
import ProductCard from "../../components/used/ProductCard";
import ProductListCard from "../../components/used/ProductListCard";
import MyProductCard from "../../components/used/MyProductCard";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import UsedEmptyView from "../../components/used/UsedEmptyView";
import TodoList from "../../components/home/TodoList";
import type { Todo } from "../../components/home/TodoList";
import LikeButton from "../../components/used/LikeButton";
import BookmarkButton from "../../components/support/BookmarkButton";
import StepCard from "../../components/guide/StepCard";
import type { GuideStep } from "../../components/guide/StepCard";
import GuideCard from "../../components/guide/GuideCard";
import GuideHeader from "../../components/guide/GuideHeader";
import SupportCard from "../../components/support/SupportCard";
import type { SupportPost } from "../../components/support/SupportCard";
import PlanCard from "../../components/ai/PlanCard";
import type { Plan } from "../../components/ai/PlanCard";
import GeneratedPlanCard from "../../components/ai/GeneratedPlanCard";
import type { Product, UsedFilter, UsedSort } from "../../types/used";
import aiCharacter from "../../assets/images/cloy-fab.png";
import {
  ChevronRightIcon,
  SearchIcon,
  TrashIcon,
  MenuHamburgerIcon,
  PlusMdIcon,
} from "../../assets/icons";

const SAMPLE_PRODUCT: Product = {
  id: 1,
  title: "2도어 냉장고 팝니다 (거의 새 제품)",
  price: 150000,
  imageUrl: null,
  dealTypes: ["직거래"],
  distanceM: 800,
  neighborhood: "원홍동",
  timeAgo: "3일 전",
  createdAt: "2026-07-10T00:00:00.000Z",
  likes: 4,
  liked: false,
};

const SAMPLE_GUIDE_STEP: GuideStep = {
  id: 1,
  title: "영업 종료일(폐업일) 산정 가이드",
  description:
    "매장 안의 물건 정리부터 세금 확정까지, 사장님이 발로 뛰는 순서 그대로 정렬했습니다.",
};

const SAMPLE_SUPPORT_POST: SupportPost = {
  id: 1,
  organization: "지원기관 텍스트",
  title: "제목 텍스트",
  period: "2000.00.00 - 2000.00.00",
  startDate: "2000-01-01",
  endDate: "2000-01-01",
  bookmarked: false,
};

const SAMPLE_PLAN: Plan = {
  id: 1,
  title: "임대인 통보 및 폐업 신고하기",
  startDate: new Date(2000, 0, 1),
  startTime: { meridiem: "오전", hour: 10, minute: 0 },
  endDate: new Date(2000, 0, 1),
  endTime: { meridiem: "오후", hour: 10, minute: 0 },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-title-3 text-gray-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

// 디자인 시스템 컴포넌트 프리뷰 (개발용) — /dev/components
export default function ComponentsPage() {
  const [text, setText] = useState("");
  const [errorText, setErrorText] = useState("Error");
  const [memo, setMemo] = useState("");
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("a");
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [bizNumber, setBizNumber] = useState("");
  const [bizStatus, setBizStatus] = useState<VerifyStatus>("idle");
  const [price, setPrice] = useState("12000");
  const [tab, setTab] = useState("notice");
  const [sort, setSort] = useState("popular");
  const [keyword, setKeyword] = useState("");
  const [chat, setChat] = useState("");
  const [date, setDate] = useState<Date | null>(new Date(2026, 4, 10));
  const [time, setTime] = useState<TimeValue>({
    meridiem: "오전",
    hour: 10,
    minute: 0,
  });
  const [showCalendar, setShowCalendar] = useState(true);
  const [showTimeWheel, setShowTimeWheel] = useState(true);
  const initialScheduleStart = getNextHour();
  const initialScheduleEnd = addHours(initialScheduleStart, 1);
  const [rangeStartDate, setRangeStartDate] =
    useState<Date>(initialScheduleStart);
  const [rangeEndDate, setRangeEndDate] = useState<Date>(initialScheduleEnd);
  const [rangeStartTime, setRangeStartTime] = useState<TimeValue>(
    toTimeValue(initialScheduleStart),
  );
  const [rangeEndTime, setRangeEndTime] = useState<TimeValue>(
    toTimeValue(initialScheduleEnd),
  );
  const [fabVariant, setFabVariant] = useState<"ai" | "used">("ai");
  const [usedFilter, setUsedFilter] = useState<UsedFilter>("all");
  const [usedSort, setUsedSort] = useState<UsedSort>("popular");
  const [liked, setLiked] = useState(false);
  const [supportBookmarked, setSupportBookmarked] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "점포 정리", done: true },
    { id: 2, text: "집기 중고 거래", done: false },
    { id: 3, text: "세금 신고", done: false },
  ]);

  const toggleTodo = (id: number) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  return (
    <div className="min-h-screen bg-gray-30 pb-24">
      <TopBar title="컴포넌트 프리뷰" />
      <div className="px-4 pt-4">
        <Section title="Button">
          <Button fullWidth>버튼</Button>
          <Button fullWidth variant="secondary">
            버튼
          </Button>
          <Button fullWidth disabled>
            버튼
          </Button>
          <Button fullWidth variant="text">
            버튼
          </Button>
          <Button fullWidth rightIcon={<ChevronRightIcon />}>
            버튼
          </Button>
          <Button fullWidth variant="warning">
            버튼
          </Button>
          <div className="flex items-center gap-2">
            <Button size="lg">버튼</Button>
            <Button size="lg" variant="secondary">
              버튼
            </Button>
            <Button size="sm">버튼</Button>
            <Button size="sm" variant="warning">
              버튼
            </Button>
            <IconButton icon={<TrashIcon />} label="버튼" />
          </div>
        </Section>

        <Section title="Progress bar">
          <ProgressBar value={45} />
        </Section>

        <Section title="Text Field">
          <TextField
            label="텍스트"
            placeholder="텍스트를 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClear={() => setText("")}
          />
          <TextField label="텍스트" value="Disabled" disabled readOnly />
          <TextField
            label="텍스트"
            value={errorText}
            onChange={(e) => setErrorText(e.target.value)}
            onClear={() => setErrorText("")}
            error="에러 메시지입니다."
          />
          <TextArea
            label="상세 메모"
            placeholder="메모를 입력하세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={500}
            showCount
          />
        </Section>

        <Section title="Checkbox / Radio">
          <div className="flex items-center gap-6">
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="할 일 리스트"
            />
            <Checkbox checked={!checked} onChange={(v) => setChecked(!v)} />
          </div>
          <div className="flex items-center gap-6">
            <Radio
              checked={radio === "a"}
              onChange={() => setRadio("a")}
              label="선택 A"
            />
            <Radio
              checked={radio === "b"}
              onChange={() => setRadio("b")}
              label="선택 B"
            />
          </div>
        </Section>

        <Section title="TodoList">
          <div className="rounded-2xl bg-white py-2">
            <TodoList todos={todos} onToggle={toggleTodo} />
          </div>
          <div className="rounded-2xl bg-white py-2">
            <TodoList todos={[]} onToggle={() => {}} />
          </div>
        </Section>

        <Section title="Select / 인증 / 가격">
          <SelectField
            label="텍스트"
            options={[1, 2, 3, 4, 5].map((n) => ({
              value: String(n),
              label: `선택 ${n}`,
            }))}
            value={selectValue}
            onChange={setSelectValue}
          />
          <SelectField
            label="텍스트"
            options={[1, 2, 3, 4, 5].map((n) => ({
              value: String(n),
              label: `선택 ${n}`,
            }))}
            value={null}
            onChange={() => {}}
            disabled
          />
          <VerifyField
            value={bizNumber}
            onChange={(v) => {
              setBizNumber(v);
              setBizStatus("idle");
            }}
            status={bizStatus}
            onVerify={() =>
              setBizStatus(
                bizNumber.replace(/\D/g, "").length === 10
                  ? "verified"
                  : "error",
              )
            }
          />
          <PriceField value={price} onChange={setPrice} />
        </Section>

        {/* TopBar는 화면 폭을 꽉 채우는 컴포넌트라 -mx-4로 페이지 좌우 패딩을 상쇄 */}
        <Section title="Top bar">
          <div className="-mx-4 space-y-3">
            <TopBar
              logo
              bordered={false}
              right={
                <button type="button" className="p-1 text-gray-900">
                  <MenuHamburgerIcon />
                </button>
              }
            />
            <TopBar
              title="제목"
              bordered={false}
              right={
                <>
                  <button type="button" className="p-1 text-gray-900">
                    <SearchIcon />
                  </button>
                  <button type="button" className="p-1 text-gray-900">
                    <MenuHamburgerIcon />
                  </button>
                </>
              }
            />
            <TopBar
              onBack={() => {}}
              right={
                <button type="button" className="p-1 text-gray-900">
                  <SearchIcon />
                </button>
              }
            />
            <TopBar onBack={() => {}} title="제목" />
            <TopBar title="제목" />
          </div>
        </Section>

        <Section title="Tabs / Chips / Dropdown">
          <Tabs
            tabs={[
              { key: "notice", label: "공고" },
              { key: "bookmark", label: "북마크" },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Chip label="전체" selected />
            <Chip label="전체" onClick={() => {}} />
            <Chip label="검색어" variant="recent" onRemove={() => {}} />
            <Chip label="추천 검색어" variant="recent" onClick={() => {}} />
            <Chip label="답변 완료" variant="badge" selected />
            <Chip label="답변 대기" variant="badge" />
          </div>
          <div className="flex justify-end">
            <Dropdown
              options={[
                { key: "popular", label: "인기순" },
                { key: "latest", label: "등록순" },
                { key: "deadline", label: "마감순" },
              ]}
              value={sort}
              onChange={setSort}
            />
          </div>
        </Section>

        <Section title="Search bar">
          <SearchBar value={keyword} onChange={setKeyword} onBack={() => {}} />
        </Section>

        <Section title="Callout">
          <Callout title="사업자 판매자 정책 안내">
            <CalloutItem>
              클로징은 1인 1사업자 인증 체계로 운영됩니다.
            </CalloutItem>
            <CalloutItem>
              이미 폐업하신 경우, 폐업일로부터 6개월 이내인 사업자만 중고
              마켓플레이스 판매자로 활동할 수 있습니다.
            </CalloutItem>
          </Callout>
        </Section>

        <Section title="CalloutBanner">
          <CalloutBanner
            title="막막한 폐업 준비가 처음이시라면?"
            description="전체적인 절차 가이드를 먼저 읽어보세요."
            actionLabel="읽기"
          />
        </Section>

        <Section title="Chat">
          <div className="flex flex-col gap-3 rounded-2xl bg-gray-100 p-4">
            {/* 상대 말풍선 (왼쪽, 흰색) */}
            <ChatBubble time="오후 2:10">안녕하세요, 문의 남깁니다.</ChatBubble>
            {/* 내 말풍선 — 읽음 + 시간 */}
            <ChatBubble me time="오후 2:10" read>
              네, 무엇을 도와드릴까요?
            </ChatBubble>
            {/* 같은 시각 연속 메시지 — 시간은 마지막 말풍선에만 표시 */}
            <ChatBubble me>집기 처분 관련해서 궁금한 게 있어요.</ChatBubble>
            <ChatBubble me time="오후 2:11">
              특히 냉장고랑 진열대 처분이 궁금해요.
            </ChatBubble>
            {/* 시간 없는 말풍선 (연속 메시지) */}
            <ChatBubble>
              여러 줄도 자연스럽게 줄바꿈되는지 확인하기 위한 긴 메시지입니다.
            </ChatBubble>
            <ChatBubble me>
              내 메시지도 최대 너비를 넘으면 이렇게 여러 줄로 감싸집니다.
            </ChatBubble>
          </div>
          <ChatInput
            value={chat}
            onChange={setChat}
            onSend={() => setChat("")}
          />
        </Section>

        <Section title="Calendar / TimeWheel">
          <div>
            <DateField
              label="날짜 설정"
              value={date}
              active={showCalendar}
              onClick={() => setShowCalendar((v) => !v)}
            />
            {showCalendar && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCalendar(false)}
                />
                <DateCalendar
                  value={date}
                  onChange={setDate}
                  className="relative z-20 mt-2"
                />
              </>
            )}
          </div>
          <div>
            <TimeField
              label="시간 설정"
              value={time}
              active={showTimeWheel}
              onClick={() => setShowTimeWheel((v) => !v)}
            />
            {showTimeWheel && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTimeWheel(false)}
                />
                <TimeWheel
                  value={time}
                  onChange={setTime}
                  className="relative z-20 mt-2 border border-gray-100"
                />
              </>
            )}
          </div>
        </Section>

        <Section title="ScheduleRangeField">
          <ScheduleRangeField
            startLabel="일정 시작"
            endLabel="일정 종료"
            startDate={rangeStartDate}
            endDate={rangeEndDate}
            startTime={rangeStartTime}
            endTime={rangeEndTime}
            onStartDateChange={setRangeStartDate}
            onEndDateChange={setRangeEndDate}
            onStartTimeChange={setRangeStartTime}
            onEndTimeChange={setRangeEndTime}
          />
        </Section>

        <Section title="LikeButton / BookmarkButton">
          <div className="flex items-center gap-3 rounded-xl bg-gray-100 p-3">
            <LikeButton liked={liked} onToggle={() => setLiked((v) => !v)} />
            <BookmarkButton
              bookmarked={supportBookmarked}
              onToggle={() => setSupportBookmarked((v) => !v)}
            />
          </div>
        </Section>

        <Section title="StepCard / SupportCard">
          <StepCard step={SAMPLE_GUIDE_STEP} />
          <SupportCard
            post={{ ...SAMPLE_SUPPORT_POST, bookmarked: supportBookmarked }}
            onToggleBookmark={() => setSupportBookmarked((v) => !v)}
          />
        </Section>

        <Section title="GuideHeader">
          <GuideHeader
            title="폐업의 시작은 건물주에게 알리는 것"
            description="말하지 않고 공사를 시작하면 계약이 자동 연장되어 가게 문을 닫고도 수개월간 월세를 더 내야 할 수 있습니다."
          />
        </Section>

        <Section title="GuideCard">
          <GuideCard
            title="언제 통보해야 하나요?"
            points={[
              {
                header: "최소 1개월 ~ 3개월 전 통보 필수",
                details: [
                  "상가임대차법상 계약 만료 최소 1개월 전까지 의사를 밝혀야 묵시적 갱신(자동 연장)을 막고 보증금을 제때 받습니다.",
                ],
              },
            ]}
          />
          <GuideCard
            title="어떻게 통보해야 안전할까요?"
            points={[
              {
                header: "구두 통보(전화)는 위험합니다",
                details: [
                  '"그런 말 들은 적 없다"고 오리발을 내미는 분쟁이 정말 많습니다.',
                ],
                buttonLabel: "문자/내용증명 복사용 작성 템플릿 보기",
              },
              {
                header: "효력이 있는 증거 남기기",
                details: [
                  "문자 메시지 또는 카카오톡 (확인 답변까지 받아두기)",
                  "가장 확실한 방법: 우체국 '내용증명' 발송",
                ],
                buttonLabel: "문자/내용증명 복사용 작성 템플릿 보기",
              },
            ]}
          />
        </Section>

        <Section title="PlanCard / GeneratedPlanCard">
          <PlanCard plan={SAMPLE_PLAN} onClick={() => {}} />
          <GeneratedPlanCard
            plan={SAMPLE_PLAN}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Section>

        <Section title="중고거래 — 필터 / 정렬 / 카드 / 빈 화면">
          <FilterTabs
            value={usedFilter}
            onChange={setUsedFilter}
            nearbyLabel="원홍동 근처"
          />
          <div className="flex justify-end">
            <SortDropdown value={usedSort} onChange={setUsedSort} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            <ProductCard
              product={{ ...SAMPLE_PRODUCT, liked }}
              onClick={() => {}}
              onToggleLike={() => setLiked((v) => !v)}
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <UsedEmptyView onWrite={() => {}} />
          </div>
        </Section>

        <Section title="중고거래 — 큰 상품 카드 / 판매 리스트 / 태그">
          <ProductListCard
            title="상품명"
            caption="캡션"
            price={0}
            liked={liked}
            onToggleLike={() => setLiked((v) => !v)}
            onClick={() => {}}
          />
          <MyProductCard
            status="selling"
            title="판매 상품 리스트"
            meta="직거래 · 원흥동 · 3시간 전"
            price={0}
            likeCount={3}
            onClick={() => {}}
            onMenuClick={() => {}}
          />
          <MyProductCard
            status="completed"
            title="판매 상품 리스트"
            meta="직거래 · 원흥동 · 3시간 전"
            price={0}
            likeCount={3}
            onClick={() => {}}
            onMenuClick={() => {}}
          />
        </Section>

        {/* Fab · NavigationBar는 fixed 포지션이라 이 섹션이 아니라 화면 하단에 고정 표시됨 */}
        <Section title="Navigation Bar / FAB">
          <p className="text-caption-2 text-gray-500">
            둘 다 fixed 포지션이라 화면 하단에 떠 있습니다.
          </p>
          <Button
            size="sm"
            onClick={() => setFabVariant((v) => (v === "ai" ? "used" : "ai"))}
          >
            FAB variant 전환 ({fabVariant})
          </Button>
          {fabVariant === "ai" ? (
            <Fab
              variant="ai"
              icon={
                <img
                  src={aiCharacter}
                  alt=""
                  className="h-6 w-6 object-contain"
                />
              }
              label="AI 맞춤 계획"
              onClick={() => {}}
            />
          ) : (
            <Fab
              variant="used"
              icon={<PlusMdIcon className="h-6 w-6 text-white" />}
              ariaLabel="글쓰기"
              onClick={() => {}}
            />
          )}
          <NavigationBar />
        </Section>
      </div>
    </div>
  );
}
