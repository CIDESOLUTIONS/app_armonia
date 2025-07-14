export async function fetchApi(
  url: string,
  method: string = "GET",
  body?: any,
  token?: string,
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Modificar la URL para apuntar al backend de NestJS
  const nestJsBaseUrl = "http://localhost:3000"; // Usar directamente por ahora
  const fullUrl = `${nestJsBaseUrl}${url}`;

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}