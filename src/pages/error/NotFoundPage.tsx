import { useNavigate } from "react-router-dom";
import { NotFoundIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-white px-6 text-center">
      <div className="flex w-[172px] flex-col items-center gap-7">
        <div className="flex flex-col items-center self-stretch">
          <div className="flex aspect-square h-20 w-20 items-center justify-center p-2">
            <NotFoundIcon className="h-16 w-16" />
          </div>

          <p className="text-title-3 text-gray-700">
            페이지를 불러오지 못했어요
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2 text-title-3 text-white"
        >
          홈으로
        </button>
      </div>
    </main>
  );
}
