// Token Utilities

// Set token to localStorage
export const setToken = (token: string | null): void => {
  if (!token) return;
  localStorage.setItem("token", token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
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

// Remove token & user info (logout)
export const removeToken = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("profileCompleted");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return Boolean(token);
};
