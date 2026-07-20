import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { AdminLayout, DashboardLayout } from "./layouts";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCinemasPage from "./pages/AdminCinemasPage";
import AdminMoviesPage from "./pages/AdminMoviesPage";
import AdminMovieFormPage from "./pages/AdminMovieFormPage";
import AdminMovieShowtimesPage from "./pages/AdminMovieShowtimesPage";
import AdminAddShowtimePage from "./pages/AdminAddShowtimePage";
import AdminPriceModelPage from "./pages/AdminPriceModelPage";
import DashboardPage from "./pages/DashboardPage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import BookingPage from "./pages/BookingPage";
import CheckoutPage from "./pages/CheckoutPage";
import { ProtectedRoute } from "./components";
import { AuthProvider } from "./contexts";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 6000,
            style: {
              background: "var(--color-surface-container-high)",
              color: "var(--color-on-surface)",
              border: "1px solid var(--color-outline-variant)",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/booking/:showtimeId" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="cinemas" element={<AdminCinemasPage />} />
              <Route path="price-models" element={<AdminPriceModelPage />} />
              <Route path="movies" element={<AdminMoviesPage />} />
              <Route path="movies/new" element={<AdminMovieFormPage />} />
              <Route path="movies/:id/edit" element={<AdminMovieFormPage />} />
              <Route
                path="movies/:id/showtimes"
                element={<AdminMovieShowtimesPage />}
              />
              <Route
                path="movies/:id/showtimes/add"
                element={<AdminAddShowtimePage />}
              />
            </Route>
          </Route>

          {/* User Routes - Protected */}
          <Route path="/my-cine" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
