import { getAuthHeader, clearAuthHeader, AUTH_INVALID_EVENT } from "./auth.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/entry";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function doFetch(url, options = {}) {
  const headers = { ...options.headers };
  const authHeader = getAuthHeader();
  if (authHeader) headers.Authorization = authHeader;

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiError(
      "Could not reach the server. Is the backend running on localhost:8080?",
      null
    );
  }

  if (response.status === 401) {
    clearAuthHeader();
    window.dispatchEvent(new Event(AUTH_INVALID_EVENT));
  }

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || `Request failed with status ${response.status}`, response.status);
  }

  return response;
}

export async function createEntry({ ruminationRating, practiceCompleted }) {
  const response = await doFetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ruminationRating, practiceCompleted }),
  });
  return response.json();
}

export async function getEntry(date) {
  const response = await doFetch(`${BASE_URL}/${date}`);
  return response.json();
}

export async function getEntryRange(startDate, endDate) {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await doFetch(`${BASE_URL}/range?${params.toString()}`);
  return response.json();
}

export async function getAverage(endDate) {
  const params = endDate ? new URLSearchParams({ endDate }) : "";
  const response = await doFetch(`${BASE_URL}/average${params ? `?${params}` : ""}`);
  return response.json();
}
