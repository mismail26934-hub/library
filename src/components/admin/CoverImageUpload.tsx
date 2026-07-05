import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/png", "image/jpeg", "image/jpg"];

interface CoverImageUploadProps {
  value?: string | null;
  previewUrl?: string | null;
  error?: string;
  onChange: (dataUrl: string | null) => void;
}

export function CoverImageUpload({ value, previewUrl, error, onChange }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error ?? localError;
  const preview = previewUrl ?? value;

  const handleFile = (file: File | null) => {
    setLocalError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!ACCEPT.includes(file.type)) {
      setLocalError("Only PNG or JPG files are allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("File must be 5mb or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center rounded-xl border border-dashed px-6 py-4 transition-colors",
          displayError
            ? "border-[#ee1d52] bg-white"
            : dragging
              ? "border-[#1C65DA] bg-[#1C65DA]/5"
              : "border-[#d5d7da] bg-white",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          <img src={preview} alt="Cover preview" className="mb-3 max-h-40 rounded-md object-contain" />
        ) : (
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-[#d5d7da]">
            <UploadCloud className="size-5 text-[var(--color-ink-muted)]" />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-1 text-sm tracking-[-0.28px]">
          <span className="font-bold text-[#1C65DA]">Click to upload</span>
          <span className="font-semibold text-[var(--color-ink)]">or drag and drop</span>
        </div>
        <p className="mt-1 text-center text-sm font-semibold tracking-[-0.28px] text-[var(--color-ink)]">
          PNG or JPG (max. 5mb)
        </p>
      </button>
      {displayError && (
        <p className="text-sm font-medium tracking-[-0.42px] text-[#ee1d52]">{displayError}</p>
      )}
    </div>
  );
}
