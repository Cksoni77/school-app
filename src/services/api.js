import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ needed for refresh cookie
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🔄 Auto refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "http://localhost:8080/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken =
          refreshRes.headers["authorization"]?.split(" ")[1];

        if (newToken) {
          sessionStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (e) {
        sessionStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(err);
  }
);

export default API;