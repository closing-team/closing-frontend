import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Dropdown from "../../components/common/Dropdown";
import TextArea from "../../components/common/TextArea";
import Button from "../../components/common/Button";
import FileAttachField from "../../components/inquiry/FileAttachField";
import { ROUTES } from "../../constants/routes";

const INQUIRY_TYPE_OPTIONS = [
  { key: "restriction", label: "이용 제한" },
  { key: "withdrawal", label: "탈퇴" },
];

export default function InquiryPage() {
  const navigate = useNavigate();

  const [inquiryType, setInquiryType] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const canSubmit = inquiryType !== "" && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: 실제 문의 등록 API 연동 (문의 유형, 내용, 첨부파일 전송)
    navigate(ROUTES.INQUIRY_HISTORY);
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      <TopBar title="1:1 문의하기" onBack={() => navigate(-1)} />

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

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-white px-4 pb-5 pt-2.5">
        <Button fullWidth disabled={!canSubmit} onClick={handleSubmit}>
          문의 등록
        </Button>
      </div>
    </div>
  );
}
