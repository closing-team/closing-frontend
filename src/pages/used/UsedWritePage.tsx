import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import TextArea from "../../components/common/TextArea";
import SelectField from "../../components/common/SelectField";
import Button from "../../components/common/Button";
import Radio from "../../components/used/Radio";
import PriceField from "../../components/used/PriceField";
import PhotoUploader from "../../components/used/PhotoUploader";
import { MarkerIcon, TargetIcon } from "../../assets/icons";
import type { DealType } from "../../types/used";
import { useUsedStore } from "../../stores/usedStore";
import { INDUSTRY_OPTIONS, ITEM_OPTIONS } from "../../mocks/used/mockUsedMeta";
import { usedDetailPath } from "../../constants/routes";

const DEFAULT_ADDRESS = "경기도 고양시 일산동구 장항동 32-1";

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

export default function UsedWritePage() {
  const navigate = useNavigate();
  const addProduct = useUsedStore((s) => s.addProduct);

  const [photoCount, setPhotoCount] = useState(0);
  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState<string | null>(null);
  const [itemCategory, setItemCategory] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [directAvailable, setDirectAvailable] = useState(true);
  const [location, setLocation] = useState("");
  const [parcelAvailable, setParcelAvailable] = useState(true);
  const [description, setDescription] = useState("");

  const canSubmit =
    title.trim().length > 0 &&
    price.length > 0 &&
    !!industry &&
    !!itemCategory &&
    (directAvailable || parcelAvailable);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const dealTypes: DealType[] = [];
    if (directAvailable) dealTypes.push("직거래");
    if (parcelAvailable) dealTypes.push("택배거래");

    const newId = addProduct({
      title: title.trim(),
      price: Number(price),
      imageUrl: null,
      dealTypes,
      distanceM: 0,
      neighborhood: "원홍동",
      timeAgo: "방금 전",
      createdAt: new Date().toISOString(),
      status: "selling",
      isMine: true,
      sellerName: "클로저 123",
      sellerNeighborhood: "원홍동",
      industry: industry ?? undefined,
      itemCategory: itemCategory ?? undefined,
      description: description.trim() || undefined,
      dealLocation: directAvailable
        ? location.trim() || DEFAULT_ADDRESS
        : undefined,
    });
    navigate(usedDetailPath(newId));
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      <TopBar title="물품 등록" onBack={() => navigate(-1)} />

      <div className="px-4 pt-5">
        {/* 물품 정보 */}
        <section className="flex flex-col gap-4 border-b border-gray-100 pb-7">
          <h2 className="pl-0.5 text-title-3 text-gray-900">물품 정보</h2>

          <div className="flex flex-col gap-3">
            <PhotoUploader count={photoCount} onChange={setPhotoCount} />

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

        {/* 판매 가격 */}
        <section className="border-b border-gray-100 py-7">
          <PriceField
            className="mb-0!"
            labelSize="subtitle-2"
            label="판매 가격"
            value={price}
            onChange={setPrice}
          />
        </section>

        {/* 거래 방식 */}
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

              <div className="relative aspect-[343/233] overflow-hidden rounded-lg bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                  <MarkerIcon className="h-8 w-8" />
                </div>
                <span className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-white/70 p-1 text-gray-700 backdrop-blur-[2px]">
                  <TargetIcon className="h-6 w-6" />
                </span>
              </div>

              <div className="flex h-[52px] items-center gap-3 rounded-lg border border-gray-100 bg-white py-2 pl-4 pr-2 shadow-[0_1px_5px_0_rgba(0,0,0,0.03),0_5px_10px_0_rgba(0,0,0,0.03)]">
                <MarkerIcon className="h-6 w-6 shrink-0 text-primary-500" />
                <span className="flex-1 truncate text-body-2 text-gray-900">
                  {DEFAULT_ADDRESS}
                </span>
              </div>

              <TextField
                className="mb-0!"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onClear={() => setLocation("")}
                placeholder="장소 직접 입력"
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

        {/* 상세 내용 */}
        <section className="pt-7">
          <TextArea
            label="상세 내용 (매물 사유, 하자 내역 등)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="폐업 예정일, 점검 이력 등을 상세히 작성하면 더욱 빠르게 판매됩니다."
            showCount
            maxLength={500}
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-white px-4 pb-5 pt-2.5">
        <Button fullWidth disabled={!canSubmit} onClick={handleSubmit}>
          등록
        </Button>
      </div>
    </div>
  );
}
