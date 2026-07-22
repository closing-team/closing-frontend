import { useEffect, useRef, useState } from "react";
import { useNaverMapsScript } from "../../hooks/useNaverMapsScript";
import { reverseGeocode } from "../../utils/naverGeocoder";
import { DEFAULT_MAP_OPTIONS } from "../../utils/naverMap";
import NaverMapFallback from "./NaverMapFallback";
import { MarkerIcon, TargetIcon } from "../../assets/icons";

interface NaverMapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  className?: string;
}

export default function NaverMapPicker({
  lat,
  lng,
  onChange,
  onAddressChange,
  className = "",
}: NaverMapPickerProps) {
  const { isLoaded, isError } = useNaverMapsScript();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const onChangeRef = useRef(onChange);
  const onAddressChangeRef = useRef(onAddressChange);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
    onAddressChangeRef.current = onAddressChange;
  });

  const updateAddress = (nextLat: number, nextLng: number) => {
    reverseGeocode(nextLat, nextLng).then((resolved) => {
      if (!resolved) return;
      setAddress(resolved);
      onAddressChangeRef.current?.(resolved);
    });
  };

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.naver) return;

    const map = new window.naver.maps.Map(containerRef.current, {
      center: new window.naver.maps.LatLng(lat, lng),
      ...DEFAULT_MAP_OPTIONS,
    });
    mapRef.current = map;
    updateAddress(lat, lng);

    const listener = window.naver.maps.Event.addListener(
      map,
      "dragend",
      () => {
        const center = map.getCenter();
        const nextLat = center.lat();
        const nextLng = center.lng();
        onChangeRef.current(nextLat, nextLng);
        updateAddress(nextLat, nextLng);
      },
    );

    return () => {
      window.naver?.maps.Event.removeListener(listener);
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleLocateMe = () => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const center = new window.naver!.maps.LatLng(latitude, longitude);
      mapRef.current?.setCenter(center);
      onChangeRef.current(latitude, longitude);
      updateAddress(latitude, longitude);
    });
  };

  if (isError) {
    return <NaverMapFallback className={className} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={`relative ${className}`}>
        <div ref={containerRef} className="h-full w-full bg-gray-100" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-4">
          <MarkerIcon className="h-8 w-8 text-primary-500" />
        </div>
        <button
          type="button"
          aria-label="내 위치로"
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-white/70 p-1 text-gray-700 backdrop-blur-[2px]"
        >
          <TargetIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-[52px] items-center gap-3 rounded-lg border border-gray-100 bg-white py-2 pl-4 pr-2 shadow-[0_1px_5px_0_rgba(0,0,0,0.03),0_5px_10px_0_rgba(0,0,0,0.03)]">
        <MarkerIcon className="h-6 w-6 shrink-0 text-primary-500" />
        <span className="flex-1 truncate text-body-2 text-gray-900">
          {address ?? "주소를 확인하는 중..."}
        </span>
      </div>
    </div>
  );
}
