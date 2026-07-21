import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-title-1 text-gray-900">404</p>
      <h1 className="mt-2 text-title-2 text-gray-900">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="mt-2 text-body-2 text-gray-500">
        주소가 잘못되었거나 삭제된 페이지예요.
      </p>
      <Button className="mt-6" onClick={() => navigate(ROUTES.HOME)}>
        홈으로 가기
      </Button>
    </main>
  );
}
