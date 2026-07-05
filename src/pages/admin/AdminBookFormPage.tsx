import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useBook, useCategories } from "@/features/books/useBooks";
import { useAuthors, useCreateBook, useUpdateBook } from "@/features/admin/useAdmin";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/states";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  authorId: z.coerce.number({ invalid_type_error: "Select an author" }).min(1, "Select an author"),
  categoryId: z.coerce.number({ invalid_type_error: "Select a category" }).min(1, "Select a category"),
  isbn: z.string().min(1, "ISBN is required"),
  publishedYear: z.coerce
    .number({ invalid_type_error: "Enter a valid year" })
    .min(0, "Enter a valid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  totalCopies: z.coerce.number({ invalid_type_error: "Enter a number" }).min(1, "At least 1 copy"),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
});

type FormValues = z.infer<typeof schema>;

export function AdminBookFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();
  const { data: book, isLoading: loadingBook } = useBook(id ?? "");
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit && book) {
      reset({
        title: book.title,
        authorId: book.authorId,
        categoryId: book.categoryId,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        totalCopies: book.totalCopies,
        description: book.description,
        coverImage: book.coverImage ?? "",
      });
    }
  }, [isEdit, book, reset]);

  const onSubmit = (v: FormValues) => {
    const payload = {
      title: v.title,
      authorId: v.authorId,
      categoryId: v.categoryId,
      isbn: v.isbn,
      publishedYear: v.publishedYear,
      totalCopies: v.totalCopies,
      description: v.description,
      coverImage: v.coverImage || null,
    };
    if (isEdit && id) {
      updateBook.mutate(
        { id: Number(id), payload },
        { onSuccess: () => navigate("/admin/books") },
      );
    } else {
      createBook.mutate(payload, { onSuccess: () => navigate("/admin/books") });
    }
  };

  const categoryOptions = [
    { label: "Select Category", value: "" },
    ...(categories ?? []).map((c) => ({ label: c.name, value: String(c.id) })),
  ];
  const authorOptions = [
    { label: "Select Author", value: "" },
    ...(authors ?? []).map((a) => ({ label: a.name, value: String(a.id) })),
  ];

  const submitting = createBook.isPending || updateBook.isPending;

  if (isEdit && loadingBook) return <LoadingSpinner label="Loading book..." />;

  return (
    <div className="mx-auto w-full max-w-[529px]">
      <button
        type="button"
        onClick={() => navigate("/admin/books")}
        className="mb-4 flex items-center gap-3 text-[var(--color-ink)]"
      >
        <ArrowLeft className="size-7" />
        <span className="text-2xl font-bold">{isEdit ? "Edit Book" : "Add Book"}</span>
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Title" error={errors.title?.message}>
          <Input className="h-12 rounded-xl" placeholder="Book title" {...register("title")} />
        </Field>

        <Field label="Author" error={errors.authorId?.message}>
          <NativeSelect options={authorOptions} {...register("authorId")} />
        </Field>

        <Field label="Category" error={errors.categoryId?.message}>
          <NativeSelect options={categoryOptions} {...register("categoryId")} />
        </Field>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Field label="ISBN" error={errors.isbn?.message} className="flex-1">
            <Input className="h-12 rounded-xl" placeholder="978-..." {...register("isbn")} />
          </Field>
          <Field label="Published Year" error={errors.publishedYear?.message} className="flex-1">
            <Input className="h-12 rounded-xl" type="number" placeholder="2024" {...register("publishedYear")} />
          </Field>
        </div>

        <Field label="Total Copies" error={errors.totalCopies?.message}>
          <Input className="h-12 rounded-xl" type="number" placeholder="10" {...register("totalCopies")} />
        </Field>

        <Field label="Description" error={errors.description?.message}>
          <Textarea className="min-h-[101px] rounded-xl" placeholder="Short description" {...register("description")} />
        </Field>

        <Field label="Cover Image URL" error={errors.coverImage?.message}>
          <Input className="h-12 rounded-xl" placeholder="https://..." {...register("coverImage")} />
        </Field>

        <Button type="submit" className="mt-2 h-12 rounded-full text-base font-bold" loading={submitting}>
          Save
        </Button>
      </form>
    </div>
  );
}

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { options: { label: string; value: string }[] }
>(({ className, options, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full appearance-none items-center rounded-xl border border-input bg-background px-4 py-2 pr-9 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
  </div>
));
NativeSelect.displayName = "NativeSelect";

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-col gap-1 " + (className ?? "")}>
      <Label className="text-sm font-bold text-[var(--color-ink)]">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
