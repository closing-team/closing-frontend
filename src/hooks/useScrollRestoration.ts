import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = new Map<string, number>();

function scrollKey(pathname: string, search: string) {
  return pathname + search;
}

// 목록에서 상세로 들어갔다가 뒤로가기(POP)로 돌아오면 스크롤 위치를 복원하고,
// 새로 진입(PUSH 및 REPLACE)하면 맨 위로 보냄. 브라우저 기본 스크롤 복원은 SPA
// 라우팅과 타이밍이 어긋나 끄고 직접 처리.
export function useScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const key = scrollKey(location.pathname, location.search);

    if (navigationType === "POP" && scrollPositions.has(key)) {
      const saved = scrollPositions.get(key) ?? 0;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.scrollTo(0, saved));
      });
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      scrollPositions.set(key, window.scrollY);
    };
  }, [location.pathname, location.search, navigationType]);
}
