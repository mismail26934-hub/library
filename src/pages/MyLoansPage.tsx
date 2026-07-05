import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, RotateCcw } from "lucide-react";
import { useMyLoans, useReturnLoan } from "@/features/loans/useLoans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/states";
import { formatDate, isOverdue } from "@/lib/utils";
import type { Loan } from "@/types";

const tabs = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Returned", label: "Returned" },
  { value: "Overdue", label: "Overdue" },
];

function statusBadge(loan: Loan) {
  if (loan.status === "RETURNED")
    return <Badge variant="success">Returned</Badge>;
  if (isOverdue(loan.dueAt, loan.status))
    return <Badge variant="destructive">Overdue</Badge>;
  return <Badge variant="info">Borrowed</Badge>;
}

export function MyLoansPage() {
  const [tab, setTab] = useState("All");
  const { data, isLoading, isError, refetch } = useMyLoans({
    status: tab === "All" ? undefined : tab,
    page: 1,
    limit: 50,
  });
  const returnLoan = useReturnLoan();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Loans</h1>
        <p className="text-muted-foreground">Track your borrowed books and due dates</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : !data || data.loans.length === 0 ? (
              <EmptyState
                title="No loans here"
                description="Borrow a book to see it listed here."
                action={
                  <Link to="/books">
                    <Button>Browse books</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {data.loans.map((loan) => {
                  const overdue = isOverdue(loan.dueAt, loan.status);
                  return (
                    <Card key={loan.id}>
                      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                        <Link to={`/books/${loan.book.id}`} className="shrink-0">
                          {loan.book.coverImage ? (
                            <img
                              src={loan.book.coverImage}
                              alt={loan.book.title}
                              className="h-24 w-16 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-24 w-16 rounded-md bg-muted" />
                          )}
                        </Link>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {statusBadge(loan)}
                            {loan.durationDays && (
                              <span className="text-xs text-muted-foreground">
                                {loan.durationDays} days
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/books/${loan.book.id}`}
                            className="block font-semibold hover:underline"
                          >
                            {loan.book.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {loan.book.author?.name}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarClock className="h-3.5 w-3.5" />
                              Borrowed: {formatDate(loan.borrowedAt)}
                            </span>
                            <span
                              className={
                                overdue ? "font-medium text-destructive" : undefined
                              }
                            >
                              Due: {formatDate(loan.dueAt)}
                            </span>
                            {loan.returnedAt && (
                              <span>Returned: {formatDate(loan.returnedAt)}</span>
                            )}
                          </div>
                        </div>
                        {loan.status !== "RETURNED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => returnLoan.mutate(loan.id)}
                            loading={returnLoan.isPending && returnLoan.variables === loan.id}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Return
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
