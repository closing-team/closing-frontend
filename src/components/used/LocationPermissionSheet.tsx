import { MarkerIcon, XCircleIcon } from "../../assets/icons";
import Button from "../common/Button";

interface LocationPermissionSheetProps {
  onAllow: () => void;
  onDeny: () => void;
  error?: string | null;
}

export default function LocationPermissionSheet({
  onAllow,
  onDeny,
  error,
}: LocationPermissionSheetProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onDeny}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative flex w-full max-w-app min-w-[var(--container-app-min)] flex-col rounded-t-[20px] bg-white px-4 pb-5 pt-2">
        <div className="flex h-4 items-center justify-center">
          <span className="h-1 w-[41px] shrink-0 rounded-[2.5px] bg-gray-200" />
        </div>

        <div className="mt-3 flex flex-col gap-5 px-4 py-2">
          <div className="flex flex-col items-start gap-2">
            <MarkerIcon className="h-9 w-9 text-primary-500" />

            <h2 className="text-title-2 text-gray-900">
              위치 정보 이용 권한 안내
            </h2>
            <p className="text-body-2 text-gray-500">
              정확한 매장 위치 확인과 사업자 인증 기반 근거리 중고거래 제공을
              위해 실시간 위치 정보 수집이 필요합니다.
            </p>
          </div>

          <p className="py-2 text-subtitle-2 text-gray-900">
            위치 정보 기록은 관련 법령에 따라 6개월간 보유됩니다.
          </p>
        </div>

        {error && (
          <p className="mt-2 flex items-center gap-1.5 px-4 text-caption-2 text-warning-500">
            <XCircleIcon className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex gap-2.5 px-4 pt-4">
          <Button fullWidth variant="secondary" onClick={onDeny}>
            허용 안함
          </Button>
          <Button fullWidth onClick={onAllow}>
            허용
          </Button>
        </div>
      </div>
    </div>
  );
}
