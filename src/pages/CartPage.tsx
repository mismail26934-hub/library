import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  toggleSelect,
  toggleSelectAll,
} from '@/features/cart/cartSlice';
import { useCartQuery, useRemoveFromCart } from '@/features/cart/useCart';
import { Button } from '@/components/ui/button';
import { EmptyState, LoadingSpinner } from '@/components/states';
import { cn } from '@/lib/utils';

function Checkbox({
  checked,
  onClick,
  className,
}: {
  checked: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors',
        checked
          ? 'border-transparent bg-[#1c65da] text-white'
          : 'border-[#a4a7ae] bg-white hover:border-[#1c65da]',
        className
      )}
    >
      {checked && <Check className='size-3.5' strokeWidth={3} />}
    </button>
  );
}

export function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((s) => s.auth.token);
  const selected = useAppSelector((s) => s.cart.selectedIds);
  const { isLoading } = useCartQuery();
  const removeFromCart = useRemoveFromCart();

  const allSelected = items.length > 0 && selected.length === items.length;
  const selectedItems = useMemo(
    () => items.filter((i) => selected.includes(i.book.id)),
    [items, selected]
  );

  const toggleAll = () => dispatch(toggleSelectAll());
  const toggleItem = (id: number) => dispatch(toggleSelect(id));
  const handleRemove = (id: number) => removeFromCart.mutate(id);

  const handleBorrow = () => {
    if (selectedItems.length === 0) return;
    if (!token) {
      toast.error('Please log in to borrow books');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout', {
      state: { bookIds: selectedItems.map((item) => item.book.id) },
    });
  };

  if (token && isLoading) {
    return <LoadingSpinner label="Loading cart..." />;
  }

  if (items.length === 0) {
    return (
      <div className='mx-auto w-full max-w-[1000px] space-y-8'>
        <h1 className='text-[28px] font-bold leading-9 text-[var(--color-ink)] md:text-4xl md:leading-[44px]'>
          My Cart
        </h1>
        <EmptyState
          title='Your cart is empty'
          description='Add books to your cart to borrow them together.'
          action={
            <Link to='/books'>
              <Button>Browse books</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[1000px] flex-col gap-6 md:gap-8',
        selectedItems.length > 0 && 'pb-28 lg:pb-0'
      )}
    >
      <h1 className='text-[28px] font-bold leading-9 text-[var(--color-ink)] md:text-4xl md:leading-[44px]'>
        My Cart
      </h1>

      <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
        {/* List */}
        <div className='flex flex-1 flex-col gap-6'>
          <label className='flex w-fit cursor-pointer items-center gap-4'>
            <Checkbox checked={allSelected} onClick={toggleAll} />
            <span className='text-base font-semibold tracking-[-0.32px] text-[var(--color-ink)]'>
              Select All
            </span>
          </label>

          {items.map((item, idx) => (
            <div key={item.book.id} className='flex flex-col gap-6'>
              <div className='flex items-start gap-4'>
                <Checkbox
                  checked={selected.includes(item.book.id)}
                  onClick={() => toggleItem(item.book.id)}
                />

                <div className='flex flex-1 items-center gap-4'>
                  <Link to={`/books/${item.book.id}`} className='shrink-0'>
                    {item.book.coverImage ? (
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className='h-[138px] w-[92px] rounded-[6px] object-cover'
                      />
                    ) : (
                      <div className='h-[138px] w-[92px] rounded-[6px] bg-muted' />
                    )}
                  </Link>

                  <div className='flex min-w-0 flex-col gap-1'>
                    <span className='w-fit rounded-[6px] border border-[#d5d7da] px-2 text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)]'>
                      {item.book.category?.name ?? 'General'}
                    </span>
                    <Link
                      to={`/books/${item.book.id}`}
                      className='truncate text-lg font-bold tracking-[-0.54px] text-[var(--color-ink)] hover:underline'
                    >
                      {item.book.title}
                    </Link>
                    <p className='truncate text-base font-medium tracking-[-0.48px] text-[var(--color-ink-muted)]'>
                      {item.book.author?.name}
                    </p>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => handleRemove(item.book.id)}
                  aria-label='Remove from cart'
                  className='shrink-0 self-center rounded-md p-2 text-[var(--color-ink-subtle)] transition-colors hover:bg-secondary hover:text-destructive'
                >
                  <Trash2 className='size-5' />
                </button>
              </div>

              {idx < items.length - 1 && (
                <hr className='border-t border-[#d5d7da]' />
              )}
            </div>
          ))}
        </div>

        {/* Loan Summary (desktop) */}
        <aside className='shadow-card hidden w-full flex-col gap-6 rounded-2xl bg-white p-5 lg:flex lg:sticky lg:top-24 lg:w-[318px] lg:shrink-0'>
          <h2 className='text-xl font-bold tracking-[-0.4px] text-[var(--color-ink)]'>
            Loan Summary
          </h2>
          <div className='flex items-center justify-between text-base text-[var(--color-ink)]'>
            <span className='font-medium tracking-[-0.48px]'>Total Book</span>
            <span className='font-bold tracking-[-0.32px]'>
              {selectedItems.length}{' '}
              {selectedItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button
            type='button'
            onClick={handleBorrow}
            disabled={selectedItems.length === 0}
            className='flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1c65da] text-base font-bold tracking-[-0.32px] text-white transition-colors hover:bg-[#1c65da]/90 disabled:opacity-60'
          >
            Borrow Book
          </button>
        </aside>
      </div>

      {/* Loan Summary floating bar (mobile) — only when at least one book selected */}
      {selectedItems.length > 0 && (
        <div className='shadow-card fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-between border-t border-[#d5d7da] bg-white px-4 lg:hidden'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium tracking-[-0.42px] text-[var(--color-ink)]'>
              Total Book
            </span>
            <span className='text-sm font-bold tracking-[-0.28px] text-[var(--color-ink)]'>
              {selectedItems.length}{' '}
              {selectedItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button
            type='button'
            onClick={handleBorrow}
            className='flex h-10 w-[150px] items-center justify-center gap-2 rounded-full bg-[#1c65da] text-sm font-bold tracking-[-0.28px] text-white transition-colors hover:bg-[#1c65da]/90 disabled:opacity-60'
          >
            Borrow Book
          </button>
        </div>
      )}
    </div>
  );
}
