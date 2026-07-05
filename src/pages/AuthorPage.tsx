import { useParams } from 'react-router-dom';
import { AuthorProfileCard } from '@/components/AuthorProfileCard';
import { BookCard } from '@/components/BookCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState, ErrorState } from '@/components/states';
import { useAuthorBooks, useAuthorFallback } from '@/features/books/useAuthor';

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data,
    isLoading: booksLoading,
    isError: booksError,
    refetch: refetchBooks,
  } = useAuthorBooks(id);

  const books = data?.books ?? [];
  const authorFromBooks = books.find((b) => b.author?.id === Number(id))?.author ?? null;

  const {
    data: authorFromList,
    isLoading: authorLoading,
    isError: authorError,
    refetch: refetchAuthor,
  } = useAuthorFallback(id, !booksLoading && !authorFromBooks);

  const author = authorFromBooks ?? authorFromList ?? null;
  const bookCount = data?.pagination.total ?? books.length;
  const isLoading = booksLoading || (!authorFromBooks && authorLoading);
  const isError = booksError || (!authorFromBooks && authorError);

  const refetch = () => {
    refetchBooks();
    refetchAuthor();
  };

  if (isLoading) {
    return (
      <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-4 lg:gap-10'>
        <Skeleton className='h-[84px] w-full rounded-2xl lg:h-[113px]' />
        <Skeleton className='h-9 w-40 lg:h-11 lg:w-48' />
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='space-y-3'>
              <Skeleton className='aspect-[230/345] w-full rounded-xl' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState message='Failed to load author.' onRetry={refetch} />;
  }

  if (!author) {
    return (
      <EmptyState
        title='Author not found'
        description='The author you are looking for does not exist.'
      />
    );
  }

  return (
    <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-4 lg:gap-10'>
      <AuthorProfileCard author={author} bookCount={bookCount} />

      <section className='flex flex-col gap-4 lg:gap-8'>
        <h1 className='text-2xl font-bold leading-9 tracking-[-0.72px] text-[var(--color-ink)] lg:text-4xl lg:leading-[44px] lg:tracking-[-0.72px]'>
          Book List
        </h1>

        {books.length === 0 ? (
          <EmptyState
            title='No books found'
            description='This author has no books in the library yet.'
          />
        ) : (
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5'>
            {books.map((book) => (
              <div key={book.id} className='min-w-0'>
                <div className='lg:hidden'>
                  <BookCard book={book} variant='mobile' />
                </div>
                <div className='hidden lg:block'>
                  <BookCard book={book} variant='desktop' />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
