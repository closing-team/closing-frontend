import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import VerifyField from "../../components/account/VerifyField";
import UnsavedChangesModal from "../../components/account/UnsavedChangesModal";
import packageCircle from "../../assets/images/package-circle.png";
import { PlusSmIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";
import { useMyProfileQuery, useUpdateProfileMutation } from "../../hooks/useAccount";
import type { UserProfileDto } from "../../types/accountApi";

interface ProfileEditFormProps {
  profile: UserProfileDto;
}

function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfile = useUpdateProfileMutation();

  const [nickname, setNickname] = useState(profile.nickname);
  const [businessNumber, setBusinessNumber] = useState(profile.businessNumber ?? "");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const isDirty = nickname !== profile.nickname || selectedImage !== null;

  const previewUrl = useMemo(
    () => (selectedImage ? URL.createObjectURL(selectedImage) : null),
    [selectedImage],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
    e.target.value = "";
  };

  const handleReverify = () => {
    navigate(ROUTES.BUSINESS_AUTH, { state: { redirectTo: ROUTES.PROFILE_EDIT } });
  };

  const handleSubmit = () => {
    if (!isDirty) {
      navigate(-1);
      return;
    }
    updateProfile.mutate(
      { nickname, image: selectedImage ?? undefined },
      { onSuccess: () => navigate(-1) },
    );
  };

  const handleBack = () => {
    if (isDirty) {
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
            <img
              src={previewUrl || profile.profileImageUrl || packageCircle}
              alt=""
              className="h-full w-full object-cover"
            />
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

        <TextField label="이름" value={profile.name} disabled />

        <TextField label="전화번호" value={profile.phone} disabled />

        <VerifyField
          label="사업자 등록 번호"
          value={businessNumber}
          onChange={setBusinessNumber}
          onVerify={handleReverify}
          status={(profile.businessVerified ?? false) ? "verified" : "idle"}
          successMessage="사업자 인증이 완료되었습니다."
          disabled={profile.businessVerified ?? false}
        />
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-white px-4 pb-5 pt-2.5">
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={updateProfile.isPending}
        >
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

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyProfileQuery();

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-30">
        <TopBar title="프로필 수정" onBack={() => navigate(-1)} />
      </div>
    );
  }

  return <ProfileEditForm profile={profile} />;
}
