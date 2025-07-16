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
      throw new Error(
        errorData.message || "Error al pre-registrar el visitante.",
      );
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

export async function scanQrCode(qrCode: string): Promise<any> {
  try {
    // Placeholder for API call to validate QR code and get visitor info
    console.log("Scanning QR Code:", qrCode);
    // Simulate API response
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        if (qrCode === "VALID_QR_CODE") {
          resolve({
            success: true,
            visitor: {
              id: "qr_vis_1",
              name: "Visitante QR",
              documentNumber: "12345",
              destination: "Apto 101",
              status: "active",
            },
          });
        } else {
          resolve({ success: false, message: "QR Code inválido." });
        }
      }, 1000),
    );
    return response;
  } catch (error) {
    console.error("Error scanning QR code:", error);
    throw new Error("Error al escanear el código QR.");
  }
}

export async function registerPackage(data: any): Promise<any> {
  try {
    // Placeholder for API call to register a package
    console.log("Registering package:", data);
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({ success: true, packageId: `pkg_${Date.now()}` });
      }, 1000),
    );
    return response;
  } catch (error) {
    console.error("Error registering package:", error);
    throw new Error("Error al registrar el paquete.");
  }
}

export async function deliverPackage(packageId: string): Promise<any> {
  try {
    // Placeholder for API call to mark package as delivered
    console.log("Delivering package:", packageId);
    const response = await new Promise((resolve) =>
      setTimeout(() => {
        resolve({ success: true, message: "Paquete entregado." });
      }, 1000),
    );
    return response;
  } catch (error) {
    console.error("Error delivering package:", error);
    throw new Error("Error al entregar el paquete.");
  }
}
