import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import WelcomePage from "./pages/WelcomePage";
import MobileVerification from "./pages/MobileVerification";
import DocumentUpload from "./pages/DocumentUpload";
import PersonalDetails from "./pages/PersonalDetails";
import AddressDetails from "./pages/AddressDetails";
import FinancialDetails from "./pages/FinancialDetails";
import ConsentPage from "./pages/ConsentPage";
import ProcessingPage from "./pages/ProcessingPage";
import { isApplicationStarted, isStepCompleted } from "./store/onboardingStore";

function StepRoute({ checkAccess, fallbackPath, element }) {
  return checkAccess() ? element : <Navigate to={fallbackPath} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route
            path="/verify-mobile"
            element={
              <StepRoute
                checkAccess={isApplicationStarted}
                fallbackPath="/"
                element={<MobileVerification />}
              />
            }
          />
          <Route
            path="/upload-doc"
            element={
              <StepRoute
                checkAccess={() => isStepCompleted("mobile")}
                fallbackPath="/verify-mobile"
                element={<DocumentUpload />}
              />
            }
          />
          <Route
            path="/personal"
            element={
              <StepRoute
                checkAccess={() => isStepCompleted("documents")}
                fallbackPath="/upload-doc"
                element={<PersonalDetails />}
              />
            }
          />
          <Route
            path="/address"
            element={
              <StepRoute
                checkAccess={() => isStepCompleted("personal")}
                fallbackPath="/personal"
                element={<AddressDetails />}
              />
            }
          />
          <Route
            path="/financial"
            element={
              <StepRoute
                checkAccess={() => isStepCompleted("address")}
                fallbackPath="/address"
                element={<FinancialDetails />}
              />
            }
          />
          <Route
            path="/consent"
            element={
              <StepRoute
                checkAccess={() => isStepCompleted("financial")}
                fallbackPath="/financial"
                element={<ConsentPage />}
              />
            }
          />
          <Route
            path="/processing"
            element={
              <StepRoute
                checkAccess={() => isStepCompleted("consent")}
                fallbackPath="/consent"
                element={<ProcessingPage />}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
