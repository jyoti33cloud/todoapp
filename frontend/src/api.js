const BASE = "http://localhost:8000/api";

const TOKEN_KEY = "todo_token";
const USER_KEY = "todo_username";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUsername: () => localStorage.getItem(USER_KEY),
  set: (token, username) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request(path, { method = "GET", body, authed = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authed) {
    const token = auth.getToken();
    if (token) headers.Authorization = `Token ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data.detail ||
      Object.values(data).flat().join(" ") ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  register: (username, password, email) =>
    request("/auth/register/", {
      method: "POST",
      body: { username, password, ...(email ? { email } : {}) },
      authed: false,
    }),
  login: (username, password) =>
    request("/auth/login/", {
      method: "POST",
      body: { username, password },
      authed: false,
    }),
  logout: () => request("/auth/logout/", { method: "POST" }),
  listTodos: () => request("/todos/"),
  createTodo: (title) => request("/todos/", { method: "POST", body: { title } }),
  updateTodo: (id, patch) =>
    request(`/todos/${id}/`, { method: "PATCH", body: patch }),
  deleteTodo: (id) => request(`/todos/${id}/`, { method: "DELETE" }),
};
