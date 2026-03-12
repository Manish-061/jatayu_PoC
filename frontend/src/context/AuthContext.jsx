import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getCurrentUserRequest,
  loginRequest,
  updateProfileRequest,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "jatayu-auth-token";
const USER_KEY = "jatayu-auth-user";

function getStoredUser() {
  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => getStoredUser());
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(window.localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const currentUser = await getCurrentUserRequest();
        setUser(currentUser);
        window.localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, [token]);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    window.localStorage.setItem(TOKEN_KEY, response.access_token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    setToken(response.access_token);
    setUser(response.user);
    return response.user;
  }

  async function updateProfile(payload) {
    const updatedUser = await updateProfileRequest(payload);
    window.localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem("jatayu-onboarding");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      updateProfile,
      logout,
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
