const STORAGE_KEY = "dailylog.auth";

export const AUTH_INVALID_EVENT = "dailylog:auth-invalid";

export function setAuthHeader(username, password) {
  sessionStorage.setItem(STORAGE_KEY, `Basic ${btoa(`${username}:${password}`)}`);
}

export function getAuthHeader() {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function clearAuthHeader() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  return getAuthHeader() !== null;
}
