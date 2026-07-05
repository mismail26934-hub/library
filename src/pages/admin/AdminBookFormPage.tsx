import * as React from 'react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useBook, useCategories } from '@/features/books/useBooks';
import {
  useAuthors,
  useCreateBook,
  useUpdateBook,
} from '@/features/admin/useAdmin';
import { CoverImageUpload } from '@/components/admin/CoverImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/states';
import { cn } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  authorId: z.coerce
    .number({ invalid_type_error: 'Author is required' })
    .min(1, 'Author is required'),
  categoryId: z.coerce
    .number({ invalid_type_error: 'Category is required' })
    .min(1, 'Category is required'),
  totalCopies: z.coerce
    .number({ invalid_type_error: 'Enter a valid number' })
    .min(1, 'Number of pages is required'),
  description: z.string().min(1, 'Description is required'),
  coverImage: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'h-12 rounded-xl border-[#d5d7da] px-4 text-sm tracking-[-0.28px] focus-visible:ring-[#1C65DA]';
const inputErrorClass = 'border-[#ee1d52] focus-visible:ring-[#ee1d52]';

export function AdminBookFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();
  const { data: book, isLoading: loadingBook } = useBook(id ?? '');
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      authorId: '' as unknown as number,
      categoryId: '' as unknown as number,
      totalCopies: '' as unknown as number,
      description: '',
      coverImage: '',
    },
  });

  const categoryId = watch('categoryId');

  useEffect(() => {
    if (isEdit && book) {
      reset({
        title: book.title,
        authorId: book.authorId,
        categoryId: book.categoryId,
        totalCopies: book.totalCopies,
        description: book.description,
        coverImage: book.coverImage ?? '',
      });
    }
  }, [isEdit, book, reset]);

  const onSubmit = (v: FormValues) => {
    const payload = {
      title: v.title,
      authorId: v.authorId,
      categoryId: v.categoryId,
      isbn: isEdit && book ? book.isbn : `AUTO-${Date.now()}`,
      publishedYear:
        isEdit && book ? book.publishedYear : new Date().getFullYear(),
      totalCopies: v.totalCopies,
      description: v.description,
      coverImage: v.coverImage || null,
    };
    if (isEdit && id) {
      updateBook.mutate(
        { id: Number(id), payload },
        {
          onSuccess: () =>
            navigate('/admin/books', { state: { successAlert: 'Edit Success' } }),
        },
      );
    } else {
      createBook.mutate(payload, {
        onSuccess: () =>
          navigate('/admin/books', { state: { successAlert: 'Add Success' } }),
      });
    }
  };

  const categoryOptions = [
    { label: 'Select Category', value: '' },
    ...(categories ?? []).map((c) => ({ label: c.name, value: String(c.id) })),
  ];
  const authorOptions = [
    { label: '', value: '' },
    ...(authors ?? []).map((a) => ({ label: a.name, value: String(a.id) })),
  ];

  const submitting = createBook.isPending || updateBook.isPending;

  if (isEdit && loadingBook) return <LoadingSpinner label='Loading book...' />;

  return (
    <div className='mx-auto w-full max-w-[529px]'>
      <button
        type='button'
        onClick={() => navigate('/admin/books')}
        className='mb-4 flex items-center gap-1.5 text-[var(--color-ink)] md:gap-3'
      >
        <ArrowLeft className='size-6 md:size-8' />
        <span className='text-xl font-bold tracking-[-0.4px] md:text-2xl md:tracking-normal'>
          {isEdit ? 'Edit Book' : 'Add Book'}
        </span>
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
        noValidate
      >
        <Field label='Title' error={errors.title?.message}>
          <Input
            className={cn(inputClass, errors.title && inputErrorClass)}
            {...register('title')}
          />
        </Field>

        <Field label='Author' error={errors.authorId?.message}>
          <AuthorSelect
            options={authorOptions}
            hasError={!!errors.authorId}
            {...register('authorId')}
          />
        </Field>

        <Field label='Category' error={errors.categoryId?.message}>
          <CategorySelect
            options={categoryOptions}
            hasError={!!errors.categoryId}
            isPlaceholder={!categoryId}
            {...register('categoryId')}
          />
        </Field>

        <Field label='Number of Pages' error={errors.totalCopies?.message}>
          <Input
            type='number'
            min={1}
            className={cn(inputClass, errors.totalCopies && inputErrorClass)}
            {...register('totalCopies')}
          />
        </Field>

        <Field label='Description' error={errors.description?.message}>
          <Textarea
            className={cn(
              'min-h-[101px] resize-none rounded-xl border-[#d5d7da] px-4 py-2 text-sm tracking-[-0.28px] focus-visible:ring-[#1C65DA]',
              errors.description && inputErrorClass
            )}
            {...register('description')}
          />
        </Field>

        <Field label='Cover Image' error={errors.coverImage?.message}>
          <Controller
            name='coverImage'
            control={control}
            render={({ field }) => (
              <CoverImageUpload
                value={field.value}
                previewUrl={isEdit ? book?.coverImage : null}
                error={errors.coverImage?.message}
                onChange={field.onChange}
              />
            )}
          />
        </Field>

        <Button
          type='submit'
          className='h-12 rounded-full text-base font-bold tracking-[-0.32px]'
          loading={submitting}
        >
          Save
        </Button>
      </form>
    </div>
  );
}

const AuthorSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { label: string; value: string }[];
    hasError?: boolean;
  }
>(({ className, options, hasError, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-12 w-full appearance-none items-center rounded-xl border bg-background px-4 text-sm tracking-[-0.28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      hasError
        ? inputErrorClass
        : 'border-[#d5d7da] focus-visible:ring-[#1C65DA]',
      className
    )}
    {...props}
  >
    {options.map((opt) => (
      <option key={opt.value || 'placeholder'} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
));
AuthorSelect.displayName = 'AuthorSelect';

const CategorySelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { label: string; value: string }[];
    hasError?: boolean;
    isPlaceholder?: boolean;
  }
>(({ className, options, hasError, isPlaceholder, ...props }, ref) => (
  <div className='relative'>
    <select
      ref={ref}
      className={cn(
        'flex h-12 w-full appearance-none items-center rounded-xl border bg-background px-4 py-2 pr-10 text-base font-medium tracking-[-0.48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isPlaceholder ? 'text-[#717680]' : 'text-[var(--color-ink)]',
        hasError
          ? inputErrorClass
          : 'border-[#d5d7da] focus-visible:ring-[#1C65DA]',
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className='pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-ink-muted)]' />
  </div>
));
CategorySelect.displayName = 'CategorySelect';

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
    <div className={cn('flex flex-col gap-0.5', className)}>
      <label className='text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)]'>
        {label}
      </label>
      {children}
      {error && (
        <p className='text-sm font-medium tracking-[-0.42px] text-[#ee1d52]'>
          {error}
        </p>
      )}
    </div>
  );
}
