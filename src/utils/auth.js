export const getToken = () => localStorage.getItem("token");

export const getUserRole = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).role : null;
};

export const isAuthenticated = () => !!getToken();
