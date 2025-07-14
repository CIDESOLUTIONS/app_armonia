
export async function createPreRegisteredVisitor(data: any) {
  try {
    const response = await fetch("/api/visitors/pre-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al pre-registrar el visitante.");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating pre-registered visitor:", error);
    throw new Error("No se pudo pre-registrar al visitante.");
  }
}

export async function getPreRegisteredVisitors() {
  try {
    const response = await fetch("/api/visitors/pre-registered");
    if (!response.ok) {
      throw new Error("Error al obtener visitantes pre-registrados.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching pre-registered visitors:", error);
    throw new Error("No se pudieron obtener los visitantes pre-registrados.");
  }
}
