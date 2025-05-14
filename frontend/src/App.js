import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer"; 
import { ToastAlert } from "./components/common/ToastAlert"; 
import BookingConfirmationPage from "./pages/bookingConfirmation/bookingConfirmationPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import EditEventPage from "./pages/EditEvantPage";
import CreateEventPage from "./pages/CreatEventPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <LoadingSpinner/>
    ); 
  }
  return (
    <>
      <Navbar />
      <ToastAlert />
      <main style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:eventId" element={<EventDetailsPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />

          {/* Admin protected routes */}
          <Route
            path="/admin/events/create"
            element={
              <ProtectedRoute adminOnly={true}>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-event/:eventId"
            element={
              <ProtectedRoute adminOnly={true}>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
