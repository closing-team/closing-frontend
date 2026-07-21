import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <TopBar title="프로필 수정" onBack={() => navigate(-1)} />
      <p className="px-4 py-10 text-center text-body-2 text-gray-500">
        준비 중입니다.
      </p>
    </div>
  );
}
