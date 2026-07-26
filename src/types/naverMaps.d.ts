export {};

declare global {
  namespace naver.maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface MapOptions {
      center: LatLng;
      zoom?: number;
      zoomControl?: boolean;
      scrollWheel?: boolean;
    }

    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
    }

    class MapEventListener {}

    const Event: {
      addListener(
        target: Map,
        eventName: string,
        listener: () => void,
      ): MapEventListener;
      removeListener(listener: MapEventListener): void;
    };

    class Point {
      constructor(x: number, y: number);
    }

    class Size {
      constructor(width: number, height: number);
    }

    interface MarkerIcon {
      content: string;
      size?: Size;
      anchor?: Point;
    }

    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      icon?: MarkerIcon;
    }

    class Marker {
      constructor(options: MarkerOptions);
    }

    namespace Service {
      const Status: { OK: string };

      enum OrderType {
        ADDR = "addr",
        ROAD_ADDR = "roadaddr",
      }

      interface ReverseGeocodeRegionArea {
        name: string;
      }

      interface ReverseGeocodeAddress {
        roadAddress?: string;
        jibunAddress?: string;
      }

      interface ReverseGeocodeResult {
        name: string;
        region?: {
          area0?: ReverseGeocodeRegionArea;
          area1?: ReverseGeocodeRegionArea;
          area2?: ReverseGeocodeRegionArea;
          area3?: ReverseGeocodeRegionArea;
          area4?: ReverseGeocodeRegionArea;
        };
      }

      interface ReverseGeocodeResponse {
        v2?: {
          address?: ReverseGeocodeAddress;
          results?: ReverseGeocodeResult[];
        };
      }

      function reverseGeocode(
        options: { coords: string; orders?: OrderType[] },
        callback: (status: string, response: ReverseGeocodeResponse) => void,
      ): void;
    }
  }

  interface Window {
    naver?: typeof naver;
  }
}
