import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import UnsavedChangesModal from "../../components/common/UnsavedChangesModal";
import TextField from "../../components/common/TextField";
import TextArea from "../../components/common/TextArea";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import Radio from "../../components/used/Radio";
import PriceField from "../../components/used/PriceField";
import PhotoUploader from "../../components/used/PhotoUploader";
import type { PhotoItem } from "../../components/used/PhotoUploader";
import UsedWriteSkeleton from "../../components/used/UsedWriteSkeleton";
import NaverMapPicker from "../../components/used/NaverMapPicker";
import Toast from "../../components/common/Toast";
import type { DealType, Product } from "../../types/used";
import { useUsedStore } from "../../stores/usedStore";
import type { GeoLocation } from "../../stores/usedStore";
import { useProductDetailQuery } from "../../hooks/useProductQueries";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateSellerLocationMutation,
} from "../../hooks/useProductMutations";
import { useMyProfileQuery } from "../../hooks/useAccount";
import { reverseGeocodeNeighborhood } from "../../utils/naverGeocoder";
import { INDUSTRY_OPTIONS, ITEM_OPTIONS } from "../../constants/usedCategories";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import { getProductSubmitErrorMessage } from "../../utils/productAdapter";

const DEFAULT_ADDRESS = "경기도 고양시 일산동구 장항동 32-1";
const DEFAULT_LAT = 37.6689;
const DEFAULT_LNG = 126.7407;

function RadioRow({
  label,
  value,
  onChange,
  bordered = false,
  className = "",
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between py-4 pl-0.5 ${bordered ? "border-b border-gray-100" : ""} ${className}`}
    >
      <span className="text-subtitle-2 text-gray-900">{label}</span>
      <div className="flex items-center gap-5">
        <Radio checked={value} onChange={() => onChange(true)} label="가능" />
        <Radio
          checked={!value}
          onChange={() => onChange(false)}
          label="불가능"
        />
      </div>
    </div>
  );
}

interface UsedWriteFormProps {
  isEditMode: boolean;
  productId?: number;
  existingProduct?: Product;
  currentLocation: GeoLocation | null;
}

function UsedWriteForm({
  isEditMode,
  productId,
  existingProduct,
  currentLocation,
}: UsedWriteFormProps) {
  const navigate = useNavigate();
  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation();
  const updateSellerLocation = useUpdateSellerLocationMutation();

  const [photos, setPhotos] = useState<PhotoItem[]>(() =>
    (existingProduct?.images ?? []).map((url) => ({
      kind: "existing" as const,
      url,
    })),
  );
  const [title, setTitle] = useState(() => existingProduct?.title ?? "");
  const [industry, setIndustry] = useState<string | null>(
    () => existingProduct?.industry ?? null,
  );
  const [itemCategory, setItemCategory] = useState<string | null>(
    () => existingProduct?.itemCategory ?? null,
  );
  const [price, setPrice] = useState(() =>
    existingProduct ? String(existingProduct.price) : "",
  );
  const [directAvailable, setDirectAvailable] = useState(() =>
    existingProduct ? existingProduct.dealTypes.includes("직거래") : true,
  );
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [addressDetail, setAddressDetail] = useState(
    () => existingProduct?.dealLocation ?? "",
  );
  const [lat, setLat] = useState(
    () => existingProduct?.lat ?? currentLocation?.lat ?? DEFAULT_LAT,
  );
  const [lng, setLng] = useState(
    () => existingProduct?.lng ?? currentLocation?.lng ?? DEFAULT_LNG,
  );
  const [parcelAvailable, setParcelAvailable] = useState(() =>
    existingProduct ? existingProduct.dealTypes.includes("택배거래") : true,
  );
  const [description, setDescription] = useState(
    () => existingProduct?.description ?? "",
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  const [initialSnapshot] = useState({
    photosLength: photos.length,
    title,
    industry,
    itemCategory,
    price,
    directAvailable,
    addressDetail,
    parcelAvailable,
    description,
  });
  const isDirty =
    photos.length !== initialSnapshot.photosLength ||
    title !== initialSnapshot.title ||
    industry !== initialSnapshot.industry ||
    itemCategory !== initialSnapshot.itemCategory ||
    price !== initialSnapshot.price ||
    directAvailable !== initialSnapshot.directAvailable ||
    addressDetail !== initialSnapshot.addressDetail ||
    parcelAvailable !== initialSnapshot.parcelAvailable ||
    description !== initialSnapshot.description;

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
      return;
    }
    navigate(-1);
  };

  const getValidationError = (): string | null => {
    if (photos.length === 0) return "물품 사진을 최소 1장 이상 등록해주세요.";
    if (title.trim().length === 0) return "물품명을 입력해 주세요.";
    if (!industry) return "업종 카테고리를 선택해 주세요.";
    if (!itemCategory) return "품목 카테고리를 선택해 주세요.";
    if (price.length === 0) return "판매 가격을 입력해 주세요.";
    if (!directAvailable && !parcelAvailable) return "거래 방식을 선택해 주세요.";
    if (description.trim().length < 10) return "물품 설명을 10자 이상 입력해 주세요.";
    return null;
  };

  // 물품을 등록 및 수정할 때 판매자 활동 지역도 함께 갱신. 직거래면 고른
  // 장소를, 택배만이면 대신 실제 GPS 현재 위치를 사용. 위치 권한이 없어
  // lat, lng이 하드코딩된 기본값으로 떨어진 경우는 잘못된 지역을 저장하게
  // 되므로 건너뜀. 상품 등록 자체와는 무관한 부가 동기화라 실패해도
  // 조용히 넘어감.
  const sellerLocationCoords = (): { lat: number; lng: number } | null => {
    if (directAvailable) return { lat, lng };
    if (currentLocation) return currentLocation;
    return null;
  };

  const syncSellerLocation = async () => {
    const coords = sellerLocationCoords();
    if (!coords) return;
    try {
      const neighborhood = await reverseGeocodeNeighborhood(
        coords.lat,
        coords.lng,
      );
      if (neighborhood) {
        updateSellerLocation.mutate({ location: neighborhood });
      }
    } catch {
      // 무시
    }
  };

  const handleSubmit = async () => {
    const validationError = getValidationError();
    if (validationError) {
      setToastMessage(validationError);
      return;
    }
    if (!industry || !itemCategory) return;
    const dealTypes: DealType[] = [];
    if (directAvailable) dealTypes.push("직거래");
    if (parcelAvailable) dealTypes.push("택배거래");

    const input = {
      title: title.trim(),
      industry,
      itemCategory,
      price: Number(price),
      dealTypes,
      description: description.trim(),
      tradeLocation: directAvailable
        ? [address, addressDetail.trim()].filter(Boolean).join(" ")
        : undefined,
      lat: directAvailable ? lat : undefined,
      lng: directAvailable ? lng : undefined,
    };

    try {
      if (isEditMode && productId !== undefined) {
        const retainedImages = photos
          .filter((p) => p.kind === "existing")
          .map((p) => p.url);
        const newImages = photos
          .filter((p) => p.kind === "new")
          .map((p) => p.file);

        await updateProduct.mutateAsync({
          productId,
          input,
          retainedImages,
          newImages,
        });
        void syncSellerLocation();
        navigate(usedDetailPath(productId), { replace: true });
        return;
      }

      const images = photos.filter((p) => p.kind === "new").map((p) => p.file);
      const created = await createProduct.mutateAsync({ input, images });
      void syncSellerLocation();
      navigate(usedDetailPath(created.productId), { replace: true });
    } catch (error) {
      setToastMessage(getProductSubmitErrorMessage(error));
    }
  };

  return (
    <div className="min-h-dvh bg-white pb-28">
      <TopBar
        title={isEditMode ? "물품 수정" : "물품 등록"}
        onBack={handleBack}
      />

      <div className="px-4 pt-5">
        <section className="flex flex-col gap-4 border-b border-gray-100 pb-7">
          <h2 className="pl-0.5 text-title-3 text-gray-900">물품 정보</h2>

          <div className="flex flex-col gap-3">
            <PhotoUploader items={photos} onChange={setPhotos} />

            <TextField
              className="mb-0!"
              labelSize="subtitle-2"
              label="물품명 / 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClear={() => setTitle("")}
              placeholder="예: 시모넬리 아피아2 2그룹"
            />

            <SelectField
              labelSize="subtitle-2"
              label="업종 카테고리"
              options={INDUSTRY_OPTIONS}
              value={industry}
              onChange={setIndustry}
              placeholder="업종을 선택하세요"
            />

            <SelectField
              labelSize="subtitle-2"
              label="품목 카테고리"
              options={ITEM_OPTIONS}
              value={itemCategory}
              onChange={setItemCategory}
              placeholder="품목을 선택하세요"
            />
          </div>
        </section>

        <section className="border-b border-gray-100 py-7">
          <PriceField
            className="mb-0!"
            labelSize="subtitle-2"
            label="판매 가격"
            value={price}
            onChange={setPrice}
          />
        </section>

        <section className="pt-7">
          <h2 className="pl-0.5 text-title-3 text-gray-900">거래 방식</h2>

          <RadioRow
            className="mt-4"
            label="직거래"
            value={directAvailable}
            onChange={setDirectAvailable}
          />

          {directAvailable && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="pl-0.5 text-subtitle-2 text-gray-900">직거래 장소</p>

              <NaverMapPicker
                lat={lat}
                lng={lng}
                onChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
                onAddressChange={setAddress}
                className="aspect-[343/233] w-full overflow-hidden rounded-lg"
              />

              <TextField
                className="mb-0!"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                onClear={() => setAddressDetail("")}
                placeholder="상세 주소 직접 입력"
              />
            </div>
          )}

          <RadioRow
            className="mt-4"
            label="택배 거래"
            value={parcelAvailable}
            onChange={setParcelAvailable}
            bordered
          />
        </section>

        <section className="pt-7">
          <TextArea
            label="물품 설명 (매물 사유, 하자 내역 등)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="폐업 예정일, 점검 이력 등을 상세히 작성하면 더욱 빠르게 판매됩니다."
            showCount
            maxLength={500}
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 flex-col gap-3 bg-white px-4 pb-5 pt-2.5">
        {toastMessage && <Toast message={toastMessage} />}
        <Button fullWidth disabled={isSubmitting} onClick={handleSubmit}>
          {isEditMode ? "수정 완료" : "등록"}
        </Button>
      </div>

      {showUnsavedModal && (
        <UnsavedChangesModal
          onCancel={() => setShowUnsavedModal(false)}
          onConfirm={() => navigate(-1)}
        />
      )}
    </div>
  );
}

export default function UsedWritePage() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { productId: productIdParam } = useParams();
  const productId = productIdParam ? Number(productIdParam) : undefined;
  const isEditMode = productId !== undefined;

  const geoLocation = useUsedStore((s) => s.location);
  const { data: profile, isLoading: isLoadingProfile } = useMyProfileQuery();
  const { data: existingProduct, isLoading: isLoadingExisting } =
    useProductDetailQuery(productId, geoLocation);

  if (isLoadingProfile || (isEditMode && isLoadingExisting)) {
    return (
      <div className="min-h-dvh bg-white">
        <TopBar
          title={isEditMode ? "물품 수정" : "물품 등록"}
          onBack={() => navigate(-1)}
        />
        <UsedWriteSkeleton />
      </div>
    );
  }

  if (!(profile?.businessVerified ?? false)) {
    return (
      <Navigate
        to={ROUTES.BUSINESS_AUTH}
        replace
        state={{ redirectTo: routerLocation.pathname }}
      />
    );
  }

  if (isEditMode && !existingProduct) {
    return (
      <div className="min-h-dvh bg-white">
        <TopBar title="물품 수정" onBack={() => navigate(-1)} />
        <p className="px-4 pt-10 text-center text-body-2 text-gray-400">
          상품을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <UsedWriteForm
      key={productId ?? "create"}
      isEditMode={isEditMode}
      productId={productId}
      existingProduct={isEditMode ? existingProduct : undefined}
      currentLocation={geoLocation}
    />
  );
}
