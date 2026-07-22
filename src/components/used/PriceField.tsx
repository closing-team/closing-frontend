import TextField from "../common/TextField";
import { formatPrice } from "../../utils/formatPrice";

const MAX_PRICE = 1_000_000_000;

interface PriceFieldProps {
  label?: string;
  labelSize?: "title-3" | "subtitle-2";
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export default function PriceField({
  label = "판매 가격",
  labelSize,
  value,
  onChange,
  error,
  placeholder = "가격",
  className = "",
}: PriceFieldProps) {
  const formatted = value ? formatPrice(Number(value)) : "";
  const overLimit = Number(value) >= MAX_PRICE;

  return (
    <TextField
      label={label}
      labelSize={labelSize}
      value={formatted}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      onClear={() => onChange("")}
      placeholder={placeholder}
      inputMode="numeric"
      leftAddon={
        <span className={value ? "text-gray-900" : "text-gray-400"}>₩</span>
      }
      error={
        error ?? (overLimit ? "10억 원 미만으로 입력해 주세요." : undefined)
      }
      className={className}
    />
  );
}
