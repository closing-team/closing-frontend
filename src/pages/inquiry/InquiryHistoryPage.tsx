import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";

export default function InquiryHistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      <TopBar title="나의 문의내역" onBack={() => navigate(-1)} />
      <p className="px-4 py-10 text-center text-body-2 text-gray-500">
        준비 중입니다.
      </p>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-white px-4 pb-5 pt-2.5">
        <Button fullWidth onClick={() => navigate(ROUTES.INQUIRY)}>
          새로운 1:1 문의하기
        </Button>
      </div>
    </div>
  );
}
