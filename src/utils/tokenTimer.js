import { logout } from "./logout";

export const startTokenTimer = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000; // seconds → ms
    const timeout = expiryTime - Date.now();

    if (timeout <= 0) {
      logout();
    } else {
      setTimeout(() => {
        logout();
      }, timeout);
    }
  } catch (err) {
    console.error("Invalid token", err);
    logout();
  }
};
