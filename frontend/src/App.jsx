import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WelcomePage from "./pages/WelcomePage";
import OnboardingFormPage from "./pages/OnboardingFormPage";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import StatusPage from "./pages/StatusPage";
import { hasStartedCase, hasSubmittedDetails } from "./store/onboardingStore";
import { useAuth } from "./context/AuthContext";

function StepRoute({ checkAccess, fallbackPath, element }) {
  return checkAccess() ? element : <Navigate to={fallbackPath} replace />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <section className="content-panel text-center text-slate-600">Loading session...</section>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <section className="content-panel text-center text-slate-600">Loading session...</section>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <OnboardingFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <StepRoute
                  checkAccess={hasSubmittedDetails}
                  fallbackPath="/apply"
                  element={<DocumentUploadPage />}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/status"
            element={
              <ProtectedRoute>
                <StepRoute
                  checkAccess={hasStartedCase}
                  fallbackPath="/apply"
                  element={<StatusPage />}
                />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
