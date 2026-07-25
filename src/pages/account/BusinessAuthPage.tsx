import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Callout, { CalloutItem } from "../../components/common/Callout";
import { ROUTES } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";

export default function BusinessAuthPage() {
  const navigate = useNavigate();
  const setAuthenticated = useUsedStore((s) => s.setAuthenticated);

  const [bizNumber, setBizNumber] = useState("");
  const [owner, setOwner] = useState("");
  const [openedAt, setOpenedAt] = useState("");

  const canSubmit =
    bizNumber.length === 10 && owner.trim().length > 0 && openedAt.length === 8;

  const formattedBizNumber =
    bizNumber.length > 5
      ? `${bizNumber.slice(0, 3)}-${bizNumber.slice(3, 5)}-${bizNumber.slice(5)}`
      : bizNumber.length > 3
        ? `${bizNumber.slice(0, 3)}-${bizNumber.slice(3)}`
        : bizNumber;

  const handleVerify = () => {
    if (!canSubmit) return;
    setAuthenticated(true);
    navigate(ROUTES.USED_WRITE, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-30">
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

        <div className="flex flex-col items-center gap-3 pb-5 pt-2.5">
          <Button fullWidth disabled={!canSubmit} onClick={handleVerify}>
            인증
          </Button>

          <p className="text-center text-caption-2 text-gray-400">
            인증에 문제가 있으신가요?{" "}
            <button
              type="button"
              className="text-caption-1 text-gray-500 underline"
            >
              고객센터 문의
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
