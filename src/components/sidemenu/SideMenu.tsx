import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import packageCircle from "../../assets/images/package-circle.png";
import Button from "../common/Button";
import ConfirmModal from "../common/ConfirmModal";
import { XLgIcon } from "../../assets/icons";
import { logoutCurrentSession } from "../../auth/logoutCurrentSession";
import { clearAuthSession } from "../../auth/authSession";
import { ROUTES } from "../../constants/routes";
import { useMyProfileQuery, useWithdrawMutation } from "../../hooks/useAccount";
import {
  getLogoutErrorMessage,
  getWithdrawErrorMessage,
} from "../../utils/authError";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
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
  bookmarkCount = 0,
  interestCount = 0,
  chatCount = 0,
}: SideMenuProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutInFlightRef = useRef(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const { data: profile } = useMyProfileQuery();
  const businessName = profile?.nickname ?? "";
  const verified = profile?.businessVerified ?? false;
  const logoutMutation = useMutation({
    mutationFn: logoutCurrentSession,
    onSuccess: () => {
      queryClient.clear();
      setShowLogoutConfirm(false);
      onClose();
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onSettled: () => {
      logoutInFlightRef.current = false;
    },
  });
  const withdraw = useWithdrawMutation();

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

        <aside className="absolute inset-y-0 right-0 flex w-[300px] flex-col overflow-y-auto bg-white py-5">
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
                src={profile?.profileImageUrl || packageCircle}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = packageCircle;
                }}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mx-5 mt-5">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => go(ROUTES.PROFILE_EDIT)}
            >
              프로필 · 사업자 정보 수정
            </Button>
          </div>

          <div className="mx-5 mt-10 border-y border-gray-100 py-4">
            <MenuRow
              label="북마크 목록"
              count={bookmarkCount}
              onClick={() => go(ROUTES.SUPPORT_BOOKMARK)}
            />
          </div>

          <div className="mx-5 flex flex-col gap-2.5 border-b border-gray-100 py-4">
            <MenuRow
              label="나의 판매물품"
              onClick={() => go(ROUTES.USED_MY)}
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
            <MenuRow
              label="문의하기"
              muted
              onClick={() => go(ROUTES.INQUIRY)}
            />
            <MenuRow
              label="나의 문의내역"
              muted
              onClick={() => go(ROUTES.INQUIRY_HISTORY)}
            />
            <MenuRow
              label="약관 및 개인정보 처리방침"
              muted
              onClick={() => go(ROUTES.POLICY)}
            />
            <MenuRow
              label="로그아웃"
              muted
              onClick={() => {
                logoutMutation.reset();
                setShowLogoutConfirm(true);
              }}
            />
          </div>

          <div className="mt-auto flex justify-center">
            <button
              type="button"
              onClick={() => setShowWithdrawConfirm(true)}
              className="flex h-[52px] w-[167px] shrink-0 items-center justify-center gap-2 rounded-lg p-2.5 text-body-2 text-gray-500 underline underline-offset-2"
            >
              클로징 탈퇴
            </button>
          </div>
        </aside>
      </div>

      {showLogoutConfirm && (
        <ConfirmModal
          title="로그아웃 할까요?"
          confirmLabel="로그아웃"
          confirmVariant="primary"
          confirmDisabled={logoutMutation.isPending}
          onCancel={() => {
            logoutMutation.reset();
            setShowLogoutConfirm(false);
          }}
          onConfirm={() => {
            if (logoutInFlightRef.current) return;

            logoutInFlightRef.current = true;
            logoutMutation.mutate();
          }}
        >
          {logoutMutation.isError && (
            <p
              role="alert"
              className="px-4 text-center text-body-2 text-warning-500"
            >
              {getLogoutErrorMessage(logoutMutation.error)}
            </p>
          )}
        </ConfirmModal>
      )}

      {showWithdrawConfirm && (
        <ConfirmModal
          title="정말 클로징 회원에서 탈퇴할까요?"
          description="삭제된 데이터는 복구되지 않습니다."
          confirmLabel="탈퇴"
          confirmDisabled={withdraw.isPending}
          onCancel={() => {
            withdraw.reset();
            setShowWithdrawConfirm(false);
          }}
          onConfirm={() => {
            withdraw.mutate(undefined, {
              onSuccess: () => {
                clearAuthSession();
                queryClient.clear();
                setShowWithdrawConfirm(false);
                onClose();
                navigate(ROUTES.LOGIN, { replace: true });
              },
            });
          }}
        >
          {withdraw.isError && (
            <p
              role="alert"
              className="px-4 text-center text-body-2 text-warning-500"
            >
              {getWithdrawErrorMessage(withdraw.error)}
            </p>
          )}
        </ConfirmModal>
      )}
    </div>
  );
}
