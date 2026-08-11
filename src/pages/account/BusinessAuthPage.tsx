import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Callout, { CalloutItem } from "../../components/common/Callout";
import Toast from "../../components/common/Toast";
import { ROUTES } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import { useVerifyBusinessMutation } from "../../hooks/useBusiness";

const DEFAULT_ERROR_MESSAGE =
  "인증 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export default function BusinessAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo ??
    ROUTES.USED_WRITE;
  const setAuthenticated = useUsedStore((s) => s.setAuthenticated);
  const verifyBusiness = useVerifyBusinessMutation();

  const [bizNumber, setBizNumber] = useState("");
  const [owner, setOwner] = useState("");
  const [openedAt, setOpenedAt] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit =
    bizNumber.length === 10 && owner.trim().length > 0 && openedAt.length === 8;

  const formattedBizNumber =
    bizNumber.length > 5
      ? `${bizNumber.slice(0, 3)}-${bizNumber.slice(3, 5)}-${bizNumber.slice(5)}`
      : bizNumber.length > 3
        ? `${bizNumber.slice(0, 3)}-${bizNumber.slice(3)}`
        : bizNumber;

  const handleVerify = async () => {
    if (!canSubmit) return;
    setErrorMessage(null);
    try {
      await verifyBusiness.mutateAsync({
        businessNumber: bizNumber,
        ownerName: owner.trim(),
        openDate: openedAt,
      });
      setAuthenticated(true);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setErrorMessage(message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <div className="min-h-screen bg-gray-30 pb-44">
      <TopBar title="사업자 인증" onBack={() => navigate(-1)} />

      <div className="flex flex-col gap-6 px-4 py-5">
        <div className="flex flex-col gap-2.5 px-0.5">
          <h1 className="text-title-2 text-gray-900">
            안전한 중고거래를 위해
            <br />
            사업자 정보를 인증해 주세요
          </h1>
          <p className="text-body-2 text-gray-500">
            국세청 조회를 통해 정상 사업자 및 폐업 6개월 이내의 사업자 자격 확인
            후 물품 등록이 가능합니다.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <TextField
            label="사업자 등록 번호"
            value={formattedBizNumber}
            onChange={(e) =>
              setBizNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            onClear={() => setBizNumber("")}
            placeholder="000-00-00000 ('-' 제외 입력)"
            inputMode="numeric"
          />
          <TextField
            label="대표자명"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            onClear={() => setOwner("")}
            placeholder="실명 성명을 입력해 주세요"
          />
          <TextField
            label="개업일자"
            value={openedAt}
            onChange={(e) =>
              setOpenedAt(e.target.value.replace(/\D/g, "").slice(0, 8))
            }
            onClear={() => setOpenedAt("")}
            placeholder="YYYYMMDD (예: 20200101)"
            inputMode="numeric"
          />
        </div>

        <Callout title="사업자 판매자 정책 안내">
          <CalloutItem>클로징은 1인 1사업자 인증 체계로 운영됩니다.</CalloutItem>
          <CalloutItem>
            이미 폐업하신 경우, 폐업일로부터 6개월 이내인 사업자만 중고
            마켓플레이스 판매자로 활동할 수 있습니다.
          </CalloutItem>
        </Callout>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 flex-col items-center gap-3 border-t border-gray-100 bg-white px-4 pb-5 pt-2.5">
        {errorMessage && <Toast message={errorMessage} />}
        <Button
          fullWidth
          disabled={!canSubmit || verifyBusiness.isPending}
          onClick={handleVerify}
        >
          인증
        </Button>

        <p className="text-center text-caption-2 text-gray-400">
          인증에 문제가 있으신가요?{" "}
          <button
            type="button"
            className="text-caption-1 text-gray-500 underline"
            onClick={() => navigate(ROUTES.INQUIRY)}
          >
            고객센터 문의
          </button>
        </p>
      </div>
    </div>
  );
}
