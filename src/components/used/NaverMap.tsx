import { useEffect, useRef } from "react";
import { useNaverMapsScript } from "../../hooks/useNaverMapsScript";
import { DEFAULT_MAP_OPTIONS, buildMarkerIconHtml } from "../../utils/naverMap";
import NaverMapFallback from "./NaverMapFallback";

interface NaverMapProps {
  lat: number;
  lng: number;
  className?: string;
}

export default function NaverMap({ lat, lng, className = "" }: NaverMapProps) {
  const { isLoaded, isError } = useNaverMapsScript();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.naver) return;

    const center = new window.naver.maps.LatLng(lat, lng);
    const map = new window.naver.maps.Map(containerRef.current, {
      center,
      ...DEFAULT_MAP_OPTIONS,
    });

    new window.naver.maps.Marker({
      position: center,
      map,
      icon: {
        content: buildMarkerIconHtml(),
        size: new window.naver.maps.Size(32, 32),
        anchor: new window.naver.maps.Point(16, 32),
      },
    });
  }, [isLoaded, lat, lng]);

  if (isError) {
    return <NaverMapFallback className={className} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative isolate bg-gray-100 ${className}`}
    />
  );
}
