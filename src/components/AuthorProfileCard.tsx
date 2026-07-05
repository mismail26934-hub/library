import { Avatar } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import type { Author } from '@/types';

function BookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 16 20' fill='none' className={className} aria-hidden='true'>
      <path
        d='M2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196666 19.0217 0.000666667 18.5507 0 18V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H14C14.55 0 15.021 0.196 15.413 0.588C15.805 0.98 16.0007 1.45067 16 2V18C16 18.55 15.8043 19.021 15.413 19.413C15.0217 19.805 14.5507 20.0007 14 20H2ZM7 9L9.5 7.5L12 9V2H7V9Z'
        fill='#1C65DA'
      />
    </svg>
  );
}

interface AuthorProfileCardProps {
  author: Author;
  bookCount: number;
}

export function AuthorProfileCard({ author, bookCount }: AuthorProfileCardProps) {
  return (
    <div className='shadow-card flex items-center gap-3 rounded-2xl bg-white p-3 lg:gap-4 lg:p-4'>
      <Avatar
        className='size-[60px] shrink-0 text-base lg:size-[81px] lg:text-xl'
        fallback={getInitials(author.name)}
      />
      <div className='flex min-w-0 flex-col gap-0.5'>
        <p className='truncate text-base font-bold leading-[30px] tracking-[-0.32px] text-[#181d27] lg:text-lg lg:leading-8 lg:tracking-[-0.54px]'>
          {author.name}
        </p>
        <div className='flex items-center gap-1.5 text-sm font-medium leading-7 tracking-[-0.42px] text-[var(--color-ink)] lg:text-base lg:leading-[30px] lg:tracking-[-0.48px]'>
          <BookGlyph className='size-6 shrink-0 lg:size-6' />
          {bookCount} {bookCount === 1 ? 'book' : 'books'}
        </div>
      </div>
    </div>
  );
}
