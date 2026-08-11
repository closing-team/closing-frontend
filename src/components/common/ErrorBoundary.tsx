import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
// 첫 화면과 함께 즉시 로드되는 컴포넌트라 아이콘 배럴(assets/icons) 대신 쓰는
// 아이콘만 직접 import. 배럴을 거치면 전체 아이콘 세트가 초기 번들에 포함
import NotFoundIcon from "../../assets/icons/not-found.svg?react";
import { ROUTES } from "../../constants/routes";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// 렌더링 중 예외 발생 시 React가 트리 전체를 언마운트해 흰 화면만 남음. 앱
// 최상단에서 잡아 복구 수단 표시. 트리가 이미 깨진 상태라 라우터 이동 대신
// 전체 새로고침으로 복구
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("렌더링 중 오류가 발생했습니다.", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-white px-6 text-center">
        <div className="flex w-[172px] flex-col items-center gap-7">
          <div className="flex flex-col items-center self-stretch">
            <div className="flex aspect-square h-20 w-20 items-center justify-center p-2">
              <NotFoundIcon className="h-16 w-16" />
            </div>

            <p className="text-title-3 text-gray-700">
              문제가 발생했어요
            </p>
            <p className="mt-2 text-body-3 text-gray-500">
              잠시 후 다시 시도해 주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.assign(ROUTES.HOME)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2 text-title-3 text-white"
          >
            홈으로
          </button>
        </div>
      </main>
    );
  }
}
