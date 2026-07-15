import TextField from "../common/TextField";
import Button from "../common/Button";

export type VerifyStatus = "idle" | "error" | "verified";

interface VerifyFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  status?: VerifyStatus;
  errorMessage?: string;
  successMessage?: string;
  placeholder?: string;
  className?: string;
}

export default function VerifyField({
  label,
  value,
  onChange,
  onVerify,
  status = "idle",
  errorMessage,
  successMessage,
  placeholder,
  className = "",
}: VerifyFieldProps) {
  const verified = status === "verified";

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 ml-0.5 block text-title-3 text-gray-900">
          {label}
        </label>
      )}
      <div className="flex items-start gap-2">
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClear={() => onChange("")}
          placeholder={placeholder}
          inputMode="numeric"
          error={status === "error" ? errorMessage : undefined}
          success={verified ? successMessage : undefined}
          className="flex-1"
        />
        <Button
          size="lg"
          variant={verified ? "secondary" : "primary"}
          disabled={!verified && value.length === 0}
          onClick={onVerify}
          className="w-[90px] shrink-0"
        >
          {verified ? "재인증" : "인증"}
        </Button>
      </div>
    </div>
  );
}
