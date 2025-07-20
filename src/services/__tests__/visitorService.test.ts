import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchApi } from "@/lib/api";
import {
  createPreRegisteredVisitor,
  getPreRegisteredVisitors,
  scanQrCode,
  registerPackage,
  deliverPackage,
  uploadVisitorImage,
  uploadPackageImage,
  getPackages,
  getPackageById,
} from "../visitorService";

// Mock fetchApi

describe("visitorService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createPreRegisteredVisitor should call fetchApi with correct parameters", async () => {
    const mockVisitorData = {
      name: "John Doe",
      documentType: "CC",
      documentNumber: "12345",
      expectedDate: "2025-01-01",
      validFrom: "2025-01-01",
      validUntil: "2025-01-01",
      residentId: 1,
      unitId: 101,
      complexId: "complex1",
    };
    (fetchApi as any).mockResolvedValueOnce({
      data: { id: 1, ...mockVisitorData },
    });

    const result = await createPreRegisteredVisitor(mockVisitorData);

    expect(fetchApi).toHaveBeenCalledWith("/visitors/pre-register", {
      method: "POST",
      body: JSON.stringify(mockVisitorData),
    });
    expect(result).toEqual({ id: 1, ...mockVisitorData });
  });

  it("getPreRegisteredVisitors should call fetchApi and return data", async () => {
    const mockVisitors = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];
    (fetchApi as any).mockResolvedValueOnce({ data: mockVisitors });

    const result = await getPreRegisteredVisitors();

    expect(fetchApi).toHaveBeenCalledWith("/visitors/pre-registered");
    expect(result).toEqual(mockVisitors);
  });

  it("scanQrCode should call fetchApi with correct parameters", async () => {
    const mockQrCode = "some-qr-code";
    const mockVisitor = { id: 1, name: "Scanned Visitor" };
    (fetchApi as any).mockResolvedValueOnce({ data: mockVisitor });

    const result = await scanQrCode(mockQrCode);

    expect(fetchApi).toHaveBeenCalledWith("/visitors/scan-qr", {
      method: "POST",
      body: JSON.stringify({ qrCode: mockQrCode }),
    });
    expect(result).toEqual(mockVisitor);
  });

  it("registerPackage should call fetchApi with correct parameters", async () => {
    const mockPackageData = {
      trackingNumber: "TRACK123",
      recipientUnit: "Apto 101",
    };
    (fetchApi as any).mockResolvedValueOnce({
      data: { id: 1, ...mockPackageData },
    });

    const result = await registerPackage(mockPackageData);

    expect(fetchApi).toHaveBeenCalledWith("/packages", {
      method: "POST",
      body: JSON.stringify(mockPackageData),
    });
    expect(result).toEqual({ id: 1, ...mockPackageData });
  });

  it("deliverPackage should call fetchApi with correct parameters", async () => {
    const packageId = 1;
    (fetchApi as any).mockResolvedValueOnce({
      data: { id: packageId, status: "DELIVERED" },
    });

    const result = await deliverPackage(packageId);

    expect(fetchApi).toHaveBeenCalledWith(`/packages/${packageId}/deliver`, {
      method: "PUT",
    });
    expect(result).toEqual({ id: packageId, status: "DELIVERED" });
  });

  it("uploadVisitorImage should call fetchApi with correct parameters", async () => {
    const mockFile = new File([""], "test.jpg", { type: "image/jpeg" });
    const mockUrl = { url: "http://example.com/test.jpg" };
    (fetchApi as any).mockResolvedValueOnce({ data: mockUrl });

    const result = await uploadVisitorImage(mockFile);

    const formData = new FormData();
    formData.append("file", mockFile);

    expect(fetchApi).toHaveBeenCalledWith(
      "/visitors/upload-image",
      {
        method: "POST",
        body: formData,
      },
      true,
    );
    expect(result).toEqual(mockUrl);
  });

  it("uploadPackageImage should call fetchApi with correct parameters", async () => {
    const mockFile = new File([""], "package.jpg", { type: "image/jpeg" });
    const mockUrl = { url: "http://example.com/package.jpg" };
    (fetchApi as any).mockResolvedValueOnce({ data: mockUrl });

    const result = await uploadPackageImage(mockFile);

    const formData = new FormData();
    formData.append("file", mockFile);

    expect(fetchApi).toHaveBeenCalledWith(
      "/packages/upload-image",
      {
        method: "POST",
        body: formData,
      },
      true,
    );
    expect(result).toEqual(mockUrl);
  });

  it("getPackages should call fetchApi and return data", async () => {
    const mockPackages = [
      { id: 1, trackingNumber: "PKG001" },
      { id: 2, trackingNumber: "PKG002" },
    ];
    (fetchApi as any).mockResolvedValueOnce({ data: mockPackages });

    const result = await getPackages();

    expect(fetchApi).toHaveBeenCalledWith("/packages?");
    expect(result).toEqual(mockPackages);
  });

  it("getPackageById should call fetchApi with correct parameters", async () => {
    const packageId = 1;
    const mockPackage = { id: packageId, trackingNumber: "PKG001" };
    (fetchApi as any).mockResolvedValueOnce({ data: mockPackage });

    const result = await getPackageById(packageId);

    expect(fetchApi).toHaveBeenCalledWith(`/packages/${packageId}`);
    expect(result).toEqual(mockPackage);
  });
});
