// Token  Utilities

// Set Token to local storage
export const setToken = (token) => {
  if (!token) return;
  localStorage.setItem("token", token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Set role to localStorage
export const setRole = (role) => {
  localStorage.setItem("role", role);
};

// Get role from localStorage
export const getRole = () => {
  return localStorage.getItem("role");
};

// Remove token from localStorage (logout)
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
