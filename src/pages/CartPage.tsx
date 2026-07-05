import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart, removeFromCart, setItemDays } from "@/features/cart/cartSlice";
import { useCheckout } from "@/features/cart/useCheckout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/states";

const durationOptions = [
  { label: "3 days", value: "3" },
  { label: "5 days", value: "5" },
  { label: "10 days", value: "10" },
];

export function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const checkout = useCheckout();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Add books to your cart to borrow them together."
          action={
            <Link to="/books">
              <Button>Browse books</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Cart ({items.length})</h1>
        <Button variant="ghost" size="sm" onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.book.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <Link to={`/books/${item.book.id}`} className="shrink-0">
                  {item.book.coverImage ? (
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="h-20 w-14 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-20 w-14 rounded-md bg-muted" />
                  )}
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/books/${item.book.id}`}
                    className="font-semibold hover:underline"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.book.author?.name}</p>
                </div>
                <Select
                  className="w-28"
                  value={String(item.days)}
                  options={durationOptions}
                  onChange={(v) =>
                    dispatch(setItemDays({ bookId: item.book.id, days: Number(v) }))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(removeFromCart(item.book.id))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-semibold">Summary</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total books</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <Button
              className="w-full"
              loading={checkout.isPending}
              onClick={() => checkout.mutate(items)}
            >
              Confirm & Borrow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
