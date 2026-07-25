import { useState } from "react";
import { useUsedStore } from "../stores/usedStore";

const LOCATION_ERROR_MESSAGE =
  "위치 정보를 가져오지 못했어요. 브라우저 설정에서 위치 권한을 허용한 후 다시 시도해 주세요.";

export function useLocationGate() {
  const locationGranted = useUsedStore((s) => s.locationGranted);
  const locationPromptAnswered = useUsedStore((s) => s.locationPromptAnswered);
  const setLocationGranted = useUsedStore((s) => s.setLocationGranted);
  const setLocationPromptAnswered = useUsedStore(
    (s) => s.setLocationPromptAnswered,
  );
  const setLocation = useUsedStore((s) => s.setLocation);
  const [showLocationModal, setShowLocationModal] = useState(
    !locationPromptAnswered,
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleAllow = () => {
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationGranted(true);
      setLocationPromptAnswered(true);
      setShowLocationModal(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setShowLocationModal(false);
      },
      () => {
        setLocationPromptAnswered(true);
        setLocationError(LOCATION_ERROR_MESSAGE);
      },
    );
  };

  const handleDeny = () => {
    setLocationPromptAnswered(true);
    setShowLocationModal(false);
  };

  return {
    locationGranted,
    showLocationModal,
    locationError,
    handleAllow,
    handleDeny,
  };
}
