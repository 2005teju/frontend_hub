// Central place that talks to the real backend / MongoDB database.
// Every page should use this instead of localStorage for any data
// that needs to be saved permanently in the database.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Always attach the JWT token (if we have one) so protected routes work
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic request helper. Throws an Error with the backend's message on failure.
async function request(path, { method = "GET", body, auth = false } = {}) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? authHeaders() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error((data && data.message) || "Something went wrong. Please try again.");
  }

  return data;
}

export const api = {
  // ----- Auth -----
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  getMe: () => request("/auth/me", { auth: true }),

  // ----- Users (admin) -----
  getUsers: () => request("/users", { auth: true }),
  approveOwner: (email) => request(`/users/${encodeURIComponent(email)}/approve`, { method: "PATCH", auth: true }),

  // ----- Shops -----
  saveShop: (payload) => request("/shops", { method: "POST", body: payload, auth: true }),
  getMyShop: () => request("/shops/me", { auth: true }),
  getShops: (params = "") => request(`/shops${params}`),
  getPendingShops: () => request("/shops/pending", { auth: true }),
  verifyShop: (email) => request(`/shops/${encodeURIComponent(email)}/verify`, { method: "PATCH", auth: true }),

  // ----- Products -----
  addProduct: (payload) => request("/products", { method: "POST", body: payload, auth: true }),
  getMyProducts: () => request("/products/mine", { auth: true }),
  getProductsByShop: (email) => request(`/products/shop/${encodeURIComponent(email)}`),
  getAllProducts: () => request("/products", { auth: true }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE", auth: true }),
  updateQuality: (id, quality) =>
    request(`/products/${id}/quality`, { method: "PATCH", body: { quality }, auth: true }),

  // ----- Orders -----
  placeOrder: (payload) => request("/orders", { method: "POST", body: payload, auth: true }),
  getMyOrders: () => request("/orders/mine", { auth: true }),

  // ----- Messages (Contact page) -----
  sendMessage: (payload) => request("/messages", { method: "POST", body: payload }),
  getMessages: () => request("/messages", { auth: true }),
};

export default api;