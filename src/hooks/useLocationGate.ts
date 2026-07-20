import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsedStore } from "../stores/usedStore";

const LOCATION_ERROR_MESSAGE =
  "위치 정보를 가져오지 못했어요. 브라우저 설정에서 위치 권한을 허용한 후 다시 시도해 주세요.";

export function useLocationGate() {
  const navigate = useNavigate();
  const locationGranted = useUsedStore((s) => s.locationGranted);
  const setLocationGranted = useUsedStore((s) => s.setLocationGranted);
  const [showLocationModal, setShowLocationModal] = useState(!locationGranted);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleAllow = () => {
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationGranted(true);
      setShowLocationModal(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationGranted(true);
        setShowLocationModal(false);
      },
      () => {
        setLocationError(LOCATION_ERROR_MESSAGE);
      },
    );
  };

  const handleDeny = () => {
    setShowLocationModal(false);
    navigate(-1);
  };

  return {
    locationGranted,
    showLocationModal,
    locationError,
    handleAllow,
    handleDeny,
  };
}
