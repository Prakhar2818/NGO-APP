// Token Utilities
import Cookies from "js-cookie";

// Cookie configuration
const TOKEN_COOKIE_NAME = "token";
const COOKIE_EXPIRY_DAYS = 7;

// Set token to cookie
export const setToken = (token: string | null): void => {
  if (!token) return;
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: COOKIE_EXPIRY_DAYS,
    secure: import.meta.env.PROD,
    sameSite: "lax",
  });
};

// Get token from cookie
export const getToken = (): string | null => {
  return Cookies.get(TOKEN_COOKIE_NAME) || null;
};

// Remove token from cookie
export const removeToken = (): void => {
  Cookies.remove(TOKEN_COOKIE_NAME);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return Boolean(token);
};


// Set role to localStorage
export const setRole = (role: string): void => {
  localStorage.setItem("role", role);
};

// Get role from localStorage
export const getRole = (): string | null => {
  return localStorage.getItem("role");
};

// Set profile completed flag
export const setProfileCompleted = (profile: boolean): void => {
  localStorage.setItem("profileCompleted", profile.toString());
};

// Get profile completed flag
export const getProfileCompleted = (): boolean => {
  return localStorage.getItem("profileCompleted") === "true";
};

// Set blocked flag
export const setIsBlocked = (isBlocked: boolean): void => {
  localStorage.setItem("isBlocked", isBlocked.toString());
};

// Get blocked flag
export const getIsBlocked = (): boolean => {
  return localStorage.getItem("isBlocked") === "true";
};

// Remove user info from localStorage
export const clearUserData = (): void => {
  localStorage.removeItem("role");
  localStorage.removeItem("profileCompleted");
  localStorage.removeItem("isBlocked");
};

// Complete logout
export const logout = (): void => {
  removeToken();
  clearUserData();
};
