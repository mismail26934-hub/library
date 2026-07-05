import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CartSync } from "@/features/cart/useCart";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { BookListPage } from "@/pages/BookListPage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { MyLoansPage } from "@/pages/MyLoansPage";
import { MyReviewsPage } from "@/pages/MyReviewsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminBooksPage } from "@/pages/admin/AdminBooksPage";
import { AdminBookFormPage } from "@/pages/admin/AdminBookFormPage";
import { AdminBookPreviewPage } from "@/pages/admin/AdminBookPreviewPage";
import { AdminBorrowedListPage } from "@/pages/admin/AdminBorrowedListPage";

export default function App() {
  return (
    <>
      <CartSync />
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin area (ADMIN role only) */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/books" replace />} />
          <Route path="/admin/books" element={<AdminBooksPage />} />
          <Route path="/admin/books/new" element={<AdminBookFormPage />} />
          <Route path="/admin/books/:id/edit" element={<AdminBookFormPage />} />
          <Route path="/admin/books/:id/preview" element={<AdminBookPreviewPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/loans" element={<AdminBorrowedListPage />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/loans" element={<MyLoansPage />} />
          <Route path="/reviews" element={<MyReviewsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </>
  );
}
