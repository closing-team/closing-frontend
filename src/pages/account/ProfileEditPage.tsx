import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import VerifyField from "../../components/account/VerifyField";
import UnsavedChangesModal from "../../components/account/UnsavedChangesModal";
import packageCircle from "../../assets/images/package-circle.png";
import { PlusSmIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";

const INITIAL_NICKNAME = "원흥동 상사";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(INITIAL_NICKNAME);
  const [name] = useState("김철수");
  const [phone] = useState("01055647756");
  const [businessNumber] = useState("000-00-00000");
  // TODO: 실제 사업자 인증 상태는 API 조회 결과로 대체
  const [verified] = useState(true);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: 실제 프로필 이미지 업로드 API 연동
    console.log("selected profile image:", e.target.files?.[0]);
  };

  const handleReverify = () => {
    // TODO: BusinessAuthPage 인증완료 후 리다이렉트가 USED_WRITE로 고정되어 있어
    // 재인증 후 프로필로 안 돌아옴 — BusinessAuthPage 담당자에게 개선 요청 필요
    navigate(ROUTES.BUSINESS_AUTH);
  };

  const handleSubmit = () => {
    // TODO: 프로필 정보 저장 API 연동
    navigate(-1);
  };

  const handleBack = () => {
    if (nickname !== INITIAL_NICKNAME) {
      setShowUnsavedModal(true);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-30 pb-28">
      <TopBar title="프로필 수정" onBack={handleBack} />

      <div className="flex flex-col items-center py-8">
        <div className="relative h-[90px] w-[90px]">
          <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
            <img src={packageCircle} alt="" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            aria-label="프로필 사진 변경"
            onClick={handlePickImage}
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-gray-900"
          >
            <PlusSmIcon className="h-3.5 w-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4">
        <TextField
          label="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onClear={() => setNickname("")}
        />

        <TextField label="이름" value={name} disabled />

        <TextField label="전화번호" value={phone} disabled />

        <VerifyField
          label="사업자 등록 번호"
          value={businessNumber}
          onChange={() => {}}
          onVerify={handleReverify}
          status={verified ? "verified" : "idle"}
          successMessage="사업자 인증이 완료되었습니다."
          disabled
        />
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-white px-4 pb-5 pt-2.5">
        <Button fullWidth onClick={handleSubmit}>
          완료
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
