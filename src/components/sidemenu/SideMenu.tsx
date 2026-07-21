import { useNavigate } from "react-router-dom";
import cloyMd from "../../assets/images/cloy-md.png";
import Button from "../common/Button";
import { XLgIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  businessName?: string;
  verified?: boolean;
  bookmarkCount?: number;
  interestCount?: number;
  chatCount?: number;
}

interface MenuRowProps {
  label: string;
  count?: number;
  muted?: boolean;
  onClick?: () => void;
}

function MenuRow({ label, count, muted = false, onClick }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex h-11 w-full items-center justify-between p-3 text-left disabled:cursor-default"
    >
      <span
        className={`text-body-1 ${muted ? "text-gray-500" : "text-gray-900"}`}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-body-1 text-gray-500">{count}</span>
      )}
    </button>
  );
}

export default function SideMenu({
  open,
  onClose,
  businessName = "원흥동 상사",
  verified = false,
  bookmarkCount = 0,
  interestCount = 0,
  chatCount = 0,
}: SideMenuProps) {
  const navigate = useNavigate();

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-center">
      <div className="relative h-full w-full max-w-app min-w-[var(--container-app-min)]">
        <button
          type="button"
          aria-label="사이드 메뉴 닫기"
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />

        <aside className="absolute inset-y-0 right-0 flex w-[300px] flex-col bg-white py-5">
          <div className="flex h-10 items-center justify-end gap-2.5 px-4">
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-gray-900"
            >
              <XLgIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-7 flex items-start justify-between px-5">
            <div className="flex flex-col gap-1">
              <p className="text-title-2 text-gray-900">{businessName}</p>
              <p className="text-body-2 text-gray-900">
                {verified ? "사업자 인증 완료" : "사업자 인증 필요"}
              </p>
            </div>
            <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full bg-gray-100">
              <img
                src={cloyMd}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mx-5 mt-5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => go(ROUTES.BUSINESS_AUTH)}
            >
              프로필 · 사업자 정보 수정
            </Button>
          </div>

          <div className="mx-5 mt-10 border-y border-gray-100 py-4">
            <MenuRow label="북마크 목록" count={bookmarkCount} />
          </div>

          <div className="mx-5 flex flex-col gap-2.5 border-b border-gray-100 py-4">
            <MenuRow
              label="나의 판매물품"
              onClick={() => go(ROUTES.USED_MY_PRODUCTS)}
            />
            <MenuRow
              label="관심 물품"
              count={interestCount}
              onClick={() => go(ROUTES.USED_LIKED)}
            />
            <MenuRow
              label="채팅"
              count={chatCount}
              onClick={() => go(ROUTES.CHAT)}
            />
          </div>

          <div className="mx-5 flex flex-col gap-2.5 border-b border-gray-100 py-4">
            <MenuRow label="문의하기" muted />
            <MenuRow label="나의 문의내역" muted />
            <MenuRow
              label="약관 및 개인정보 처리방침"
              muted
              onClick={() => go(ROUTES.TERMS)}
            />
            <MenuRow
              label="로그아웃"
              muted
              onClick={() => go(ROUTES.LOGIN)}
            />
          </div>

          <div className="mt-auto flex justify-center">
            <button
              type="button"
              className="flex h-[52px] w-[167px] shrink-0 items-center justify-center gap-2 rounded-lg p-2.5 text-body-2 text-gray-500 underline underline-offset-2"
            >
              클로징 탈퇴
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
