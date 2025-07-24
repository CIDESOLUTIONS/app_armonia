import { describe, it, expect, vi, beforeEach } from "vitest";
import apiClient from "@/lib/apiClient";
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

vi.mock("@/lib/apiClient");

describe("visitorService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createPreRegisteredVisitor should call apiClient with correct parameters", async () => {
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
    const response = { data: { id: 1, qrCode: "qr", ...mockVisitorData } };
    (apiClient.post as any).mockResolvedValue(response);

    const result = await createPreRegisteredVisitor(mockVisitorData);

    expect(apiClient.post).toHaveBeenCalledWith("/visitors/pre-register", mockVisitorData);
    expect(result).toEqual(response.data);
  });

  it("getPreRegisteredVisitors should call apiClient and return data", async () => {
    const mockVisitors = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];
    (apiClient.get as any).mockResolvedValue({ data: mockVisitors });

    const result = await getPreRegisteredVisitors();

    expect(apiClient.get).toHaveBeenCalledWith("/visitors/pre-registered");
    expect(result).toEqual(mockVisitors);
  });

  it("scanQrCode should call apiClient with correct parameters", async () => {
    const mockQrCode = "some-qr-code";
    const mockVisitor = { id: 1, name: "Scanned Visitor" };
    (apiClient.post as any).mockResolvedValue({ data: mockVisitor });

    const result = await scanQrCode(mockQrCode);

    expect(apiClient.post).toHaveBeenCalledWith("/visitors/scan-qr", { qrCode: mockQrCode });
    expect(result).toEqual(mockVisitor);
  });

  it("registerPackage should call apiClient with correct parameters", async () => {
    const mockPackageData = {
      trackingNumber: "TRACK123",
      recipientUnit: "Apto 101",
    };
    const response = { data: { id: 1, status: "PENDING", createdAt: "", ...mockPackageData } };
    (apiClient.post as any).mockResolvedValue(response);

    const result = await registerPackage(mockPackageData);

    expect(apiClient.post).toHaveBeenCalledWith("/packages", mockPackageData);
    expect(result).toEqual(response.data);
  });

  it("deliverPackage should call apiClient with correct parameters", async () => {
    const packageId = 1;
    const response = { data: { id: packageId, status: "DELIVERED" } };
    (apiClient.put as any).mockResolvedValue(response);

    const result = await deliverPackage(packageId);

    expect(apiClient.put).toHaveBeenCalledWith(`/packages/${packageId}/deliver`);
    expect(result).toEqual(response.data);
  });

  it("uploadVisitorImage should call apiClient with correct parameters", async () => {
    const mockFile = new File([""], "test.jpg", { type: "image/jpeg" });
    const mockUrl = { url: "http://example.com/test.jpg" };
    (apiClient.post as any).mockResolvedValue({ data: mockUrl });

    const result = await uploadVisitorImage(mockFile);

    const formData = new FormData();
    formData.append("file", mockFile);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/visitors/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    expect(result).toEqual(mockUrl);
  });

  it("uploadPackageImage should call apiClient with correct parameters", async () => {
    const mockFile = new File([""], "package.jpg", { type: "image/jpeg" });
    const mockUrl = { url: "http://example.com/package.jpg" };
    (apiClient.post as any).mockResolvedValue({ data: mockUrl });

    const result = await uploadPackageImage(mockFile);

    const formData = new FormData();
    formData.append("file", mockFile);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/packages/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    expect(result).toEqual(mockUrl);
  });

  it("getPackages should call apiClient and return data", async () => {
    const mockPackages = [
      { id: 1, trackingNumber: "PKG001" },
      { id: 2, trackingNumber: "PKG002" },
    ];
    (apiClient.get as any).mockResolvedValue({ data: mockPackages });

    const result = await getPackages();

    expect(apiClient.get).toHaveBeenCalledWith("/packages?");
    expect(result).toEqual(mockPackages);
  });

  it("getPackageById should call apiClient with correct parameters", async () => {
    const packageId = 1;
    const mockPackage = { id: packageId, trackingNumber: "PKG001" };
    (apiClient.get as any).mockResolvedValue({ data: mockPackage });

    const result = await getPackageById(packageId);

    expect(apiClient.get).toHaveBeenCalledWith(`/packages/${packageId}`);
    expect(result).toEqual(mockPackage);
  });
});
