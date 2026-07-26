import { useEffect, useState } from "react";
import { useNaverMapsScript } from "./useNaverMapsScript";
import { reverseGeocodeNeighborhood } from "../utils/naverGeocoder";
import { DEFAULT_NEARBY_LABEL } from "../constants/location";
import type { GeoLocation } from "../stores/usedStore";

export function useNearbyLabel(location: GeoLocation | null): string {
  const { isLoaded } = useNaverMapsScript();
  const [label, setLabel] = useState(DEFAULT_NEARBY_LABEL);

  useEffect(() => {
    if (!location || !isLoaded) return;
    let cancelled = false;

    reverseGeocodeNeighborhood(location.lat, location.lng).then((name) => {
      if (!cancelled && name) setLabel(`${name} 근처`);
    });

    return () => {
      cancelled = true;
    };
  }, [location, isLoaded]);

  return label;
}
