import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useBooks } from '@/features/books/useBooks';
import { useDeleteBook } from '@/features/admin/useAdmin';
import { useDebounce } from '@/lib/useDebounce';
import { AdminBookCard } from '@/components/admin/AdminBookCard';
import { SuccessAlert } from '@/components/admin/SuccessAlert';
import { SearchLarge } from '@/components/admin/SearchLarge';
import { FilterPills } from '@/components/admin/FilterPills';
import { Pagination } from '@/components/admin/Pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EmptyState, ErrorState } from '@/components/states';
import type { Book } from '@/types';

const LIMIT = 10;

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Borrowed', value: 'borrowed' },
  { label: 'Returned', value: 'returned' },
];

function matchesFilter(book: Book, filter: string): boolean {
  switch (filter) {
    case 'available':
      return book.availableCopies > 0;
    case 'borrowed':
      return book.availableCopies < book.totalCopies;
    case 'returned':
      return book.availableCopies === book.totalCopies;
    default:
      return true;
  }
}

export function AdminBooksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const debounced = useDebounce(search, 450);

  useEffect(() => {
    const message = (location.state as { successAlert?: string } | null)?.successAlert;
    if (!message) return;
    setSuccessAlert(message);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const query = useMemo(
    () => ({ page, limit: LIMIT, q: debounced || undefined }),
    [page, debounced]
  );

  const { data, isLoading, isError, refetch, isFetching } = useBooks(query);
  const deleteBook = useDeleteBook();

  const books = (data?.books ?? []).filter((b) => matchesFilter(b, filter));

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteBook.mutate(toDelete.id, {
      onSuccess: () => {
        setToDelete(null);
        setSuccessAlert('Delete Success');
      },
    });
  };

  return (
    <>
      {successAlert && (
        <SuccessAlert message={successAlert} onClose={() => setSuccessAlert(null)} />
      )}
    <div className='flex flex-col gap-[15px] md:gap-6'>
      <div className='flex flex-col gap-[15px] md:gap-6'>
        <h1 className='text-2xl font-bold leading-9 tracking-[-0.72px] text-[var(--color-ink)] md:text-[28px] md:tracking-[-0.84px]'>
          Book List
        </h1>
        <Button
          className='h-11 w-full rounded-full text-base font-bold tracking-[-0.32px] md:h-12 md:w-60'
          onClick={() => navigate('/admin/books/new')}
        >
          <Plus className='hidden size-5 sm:inline' /> Add Book
        </Button>
        <SearchLarge
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder='Search book'
          className='h-11 w-full md:h-12 md:max-w-[600px]'
        />
        <FilterPills options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className='h-[170px] w-full rounded-2xl md:h-[178px]'
            />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message='Failed to load books.' onRetry={() => refetch()} />
      ) : books.length === 0 ? (
        <EmptyState
          title='No books found'
          description='Try adjusting your search or filter.'
        />
      ) : (
        <>
          <div className='flex flex-col gap-4 md:hidden'>
            {books.map((book) => (
              <AdminBookCard
                key={book.id}
                book={book}
                onPreview={() => navigate(`/admin/books/${book.id}/preview`)}
                onEdit={() => navigate(`/admin/books/${book.id}/edit`)}
                onDelete={() => setToDelete(book)}
              />
            ))}
          </div>
          <div className='hidden flex-col gap-4 md:flex'>
            {books.map((book) => (
              <BookRow
                key={book.id}
                book={book}
                onPreview={() => navigate(`/admin/books/${book.id}/preview`)}
                onEdit={() => navigate(`/admin/books/${book.id}/edit`)}
                onDelete={() => setToDelete(book)}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data?.pagination.totalPages ?? 1}
            total={data?.pagination.total}
            limit={LIMIT}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent className='max-w-[452px] rounded-2xl'>
          <h2 className='text-xl font-bold tracking-[-0.4px] text-[var(--color-ink)]'>
            Delete Data
          </h2>
          <p className='mt-1 text-base font-semibold leading-[30px] tracking-[-0.32px] text-[var(--color-ink)]'>
            Once deleted, you won&apos;t be able to recover this data.
          </p>
          <div className='mt-5 flex gap-3'>
            <Button
              variant='outline'
              className='h-11 flex-1 rounded-full font-bold'
              onClick={() => setToDelete(null)}
              disabled={deleteBook.isPending}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              className='h-11 flex-1 rounded-full font-bold'
              onClick={confirmDelete}
              loading={deleteBook.isPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}

interface BookRowProps {
  book: Book;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function BookRow({ book, onPreview, onEdit, onDelete }: BookRowProps) {
  return (
    <div className='shadow-card flex flex-col gap-4 rounded-2xl bg-white p-5 md:flex-row md:items-center md:justify-between md:gap-6'>
      <div className='flex min-w-0 flex-1 items-center gap-4'>
        <div className='h-[138px] w-[92px] shrink-0 overflow-hidden rounded-md bg-secondary'>
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className='size-full object-cover'
            />
          )}
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-1 overflow-hidden'>
          <span className='w-fit rounded-md border border-[var(--color-border)] px-2 text-sm font-bold text-[var(--color-ink)]'>
            {book.category?.name ?? 'Uncategorized'}
          </span>
          <p
            className='line-clamp-2 text-lg font-bold leading-snug tracking-[-0.54px] text-[var(--color-ink)]'
            title={book.title}
          >
            {book.title}
          </p>
          <p className='truncate font-medium tracking-[-0.48px] text-[var(--color-ink-muted)]'>
            {book.author?.name ?? '-'}
          </p>
          <div className='flex items-center gap-1'>
            <Star className='size-6 fill-[var(--color-star)] text-[var(--color-star)]' />
            <span className='font-bold text-[var(--color-ink-strong)]'>
              {book.rating ?? 0}
            </span>
          </div>
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-3'>
        <Button
          variant='outline'
          className='h-12 flex-1 rounded-full font-bold md:w-[95px] md:flex-none'
          onClick={onPreview}
        >
          Preview
        </Button>
        <Button
          variant='outline'
          className='h-12 flex-1 rounded-full font-bold md:w-[95px] md:flex-none'
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          variant='outline'
          className='h-12 flex-1 rounded-full font-bold text-[#ee1d52] md:w-[95px] md:flex-none'
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
