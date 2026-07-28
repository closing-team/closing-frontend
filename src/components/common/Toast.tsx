interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-body-2 text-white"
      style={{ backgroundColor: "#48464A" }}
    >
      {message}
    </div>
  );
}
