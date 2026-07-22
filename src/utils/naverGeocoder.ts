export function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!window.naver?.maps.Service) {
      resolve(null);
      return;
    }

    window.naver.maps.Service.reverseGeocode(
      {
        coords: `${lng},${lat}`,
        orders: [
          window.naver.maps.Service.OrderType.ROAD_ADDR,
          window.naver.maps.Service.OrderType.ADDR,
        ],
      },
      (status, response) => {
        if (status !== window.naver!.maps.Service.Status.OK) {
          resolve(null);
          return;
        }

        const address = response.v2?.address;
        resolve(address?.roadAddress || address?.jibunAddress || null);
      },
    );
  });
}
