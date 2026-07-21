import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import { guideDetailPath } from "../../constants/routes";

export default function GuideReportTemplatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <TopBar
        title="문자/내용증명 복사용 작성 템플릿"
        onBack={() => navigate(guideDetailPath(6))}
      />
      <p className="px-4 py-10 text-center text-body-2 text-gray-500">
        준비 중입니다.
      </p>
    </div>
  );
}
