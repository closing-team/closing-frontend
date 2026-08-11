import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../../components/common/TopBar";
import Dropdown from "../../components/common/Dropdown";
import TextArea from "../../components/common/TextArea";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import FileAttachField from "../../components/inquiry/FileAttachField";
import UnsavedChangesModal from "../../components/common/UnsavedChangesModal";
import { ROUTES } from "../../constants/routes";
import { useCreateInquiryMutation } from "../../hooks/useInquiries";

const INQUIRY_TYPE_OPTIONS = [
  { key: "restriction", label: "이용 제한" },
  { key: "withdrawal", label: "탈퇴" },
];

const DEFAULT_ERROR_MESSAGE =
  "문의 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export default function InquiryPage() {
  const navigate = useNavigate();
  const createInquiry = useCreateInquiryMutation();

  const [inquiryType, setInquiryType] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const isDirty =
    inquiryType !== "" || content.trim().length > 0 || attachments.length > 0;

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
      return;
    }
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (inquiryType === "") {
      setToastMessage("문의 유형을 선택해 주세요.");
      return;
    }
    if (content.trim().length === 0) {
      setToastMessage("문의 내용을 입력해 주세요.");
      return;
    }
    try {
      await createInquiry.mutateAsync({
        input: { type: inquiryType, content: content.trim() },
        images: attachments,
      });
      navigate(ROUTES.INQUIRY_HISTORY);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      setToastMessage(message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <div className="min-h-dvh bg-white pb-28">
      <TopBar title="1:1 문의하기" onBack={handleBack} />

      <div className="flex flex-col gap-5 px-4 pt-5">
        <Dropdown
          variant="field"
          label="문의 유형 선택"
          placeholder="유형을 선택해 주세요 (예: 이용 제한, 탈퇴)"
          options={INQUIRY_TYPE_OPTIONS}
          value={inquiryType}
          onChange={setInquiryType}
          hideSelectedFromList={false}
        />

        <TextArea
          label="문의 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            "문의하실 내용을 상세히 적어주세요.\n구체적인 정황이 포함되면 신속한 처리가 가능합니다."
          }
          maxLength={500}
          showCount
        />

        <FileAttachField files={attachments} onChange={setAttachments} max={3} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 flex-col gap-3 bg-white px-4 pb-5 pt-2.5">
        {toastMessage && <Toast message={toastMessage} />}
        <Button
          fullWidth
          disabled={createInquiry.isPending}
          onClick={handleSubmit}
        >
          문의 등록
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
