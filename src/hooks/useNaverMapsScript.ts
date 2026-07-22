import { useEffect, useState } from "react";

const NAVER_MAPS_SCRIPT_ID = "naver-maps-sdk";
const CALLBACK_NAME = "__naverMapsReady__";

let loadPromise: Promise<void> | null = null;

function loadNaverMapsScript(clientId: string): Promise<void> {
  if (window.naver?.maps?.Service) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // 지도 스크립트의 onload는 geocoder 같은 서브모듈이 내부적으로
    // 비동기 추가 로드되기 전에 먼저 발생할 수 있다. 서브모듈까지
    // 전부 준비된 시점을 알려주는 전용 callback 파라미터를 사용한다.
    (window as unknown as Record<string, () => void>)[CALLBACK_NAME] = () => {
      resolve();
    };

    if (document.getElementById(NAVER_MAPS_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = NAVER_MAPS_SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder&callback=${CALLBACK_NAME}`;
    script.async = true;
    script.onerror = () =>
      reject(new Error("naver maps script failed to load"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function useNaverMapsScript() {
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID as
    | string
    | undefined;
  const [isLoaded, setIsLoaded] = useState(!!window.naver?.maps?.Service);
  const [isScriptError, setIsScriptError] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;

    loadNaverMapsScript(clientId)
      .then(() => {
        if (!cancelled) setIsLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setIsScriptError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return { isLoaded, isError: isScriptError || !clientId };
}
