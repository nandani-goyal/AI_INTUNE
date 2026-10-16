export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://ai-intune-2.onrender.com"
    : "http://localhost:5000");

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${BACKEND_URL}/api`;

export const API = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...options
    }
  );

  const contentType = res.headers.get("content-type") || "";
  let data: any = {};
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    throw new Error(
      `Server returned non-JSON response (${res.status} ${res.statusText}). Check backend status.`
    );
  }

  if (!res.ok) throw new Error(data.msg || 'Request failed');
  return data as T;
};
