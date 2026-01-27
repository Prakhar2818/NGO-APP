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

// Set profile completed from localStorage
export const setProfileCompleted = (profile) => {
  localStorage.setItem("profileCompleted", profile.toString());
};

//Get profile completed localStorage
export const getProfileCompleted = () => {
  return localStorage.getItem("profileCompleted") === "true";
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("profileCompleted")
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
