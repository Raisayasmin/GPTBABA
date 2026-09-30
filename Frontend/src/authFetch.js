export default async function authFetch(url, options = {}) {
  let token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    // const refreshResponse = await fetch("http://localhost:8080/api/refresh", {
     const refreshResponse = await fetch(`${API_URL}/api/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return response;
    }

    const refreshData = await refreshResponse.json();
    localStorage.setItem("token", refreshData.token);

    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${refreshData.token}`,
      },
    });
  }

  return response;
}