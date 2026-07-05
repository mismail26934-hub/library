import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/png", "image/jpeg", "image/jpg"];

interface ProfilePhotoUploadProps {
  value?: string | null;
  error?: string;
  onChange: (value: string) => void;
}

export function ProfilePhotoUpload({ value, error, onChange }: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error ?? localError;
  const preview = value?.trim() || null;

  const handleFile = (file: File | null) => {
    setLocalError(null);
    if (!file) return;

    if (!ACCEPT.includes(file.type)) {
      setLocalError("Only PNG or JPG files are allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("File must be 5mb or smaller");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setLocalError(null);
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <LabelRow />
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-xl border border-[#d5d7da] px-4 py-5",
          displayError && "border-[#ee1d52]",
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="size-[120px] rounded-full object-cover"
          />
        ) : (
          <div className="flex size-[120px] items-center justify-center rounded-full bg-[#f5f5f5] text-sm font-semibold text-[var(--color-ink-muted)]">
            No photo
          </div>
        )}

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[#d5d7da] text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)] transition-colors hover:bg-secondary"
          >
            <Upload className="size-4" aria-hidden />
            Change Image
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!preview}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[#d5d7da] text-sm font-bold tracking-[-0.28px] text-[#ee1d52] transition-colors hover:bg-[#ee1d52]/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="size-4" aria-hidden />
            Delete Image
          </button>
        </div>

        <p className="text-center text-sm font-semibold tracking-[-0.28px] text-[var(--color-ink)]">
          PNG or JPG (max. 5mb)
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {displayError && (
        <p className="text-xs font-medium text-[#ee1d52]">{displayError}</p>
      )}
    </div>
  );
}

function LabelRow() {
  return (
    <span className="text-sm font-medium leading-none text-[var(--color-ink)]">
      Profile Photo
    </span>
  );
}
