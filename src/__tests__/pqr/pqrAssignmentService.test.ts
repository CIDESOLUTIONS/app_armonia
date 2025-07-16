import { PQRAssignmentService } from "@/services/pqrAssignmentService";
import { PQRCategory, PQRPriority } from "@prisma/client";
import { prismaMock } from "@/__mocks__/prisma";

describe("PQRAssignmentService", () => {
  let service: PQRAssignmentService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PQRAssignmentService();
  });

  describe("processPQR", () => {
    it("debe procesar un PQR completo con categoría y prioridad ya definidas", async () => {
      const pqrData = {
        type: "COMPLAINT",
        title: "Problema con la iluminación",
        description: "Las luces del pasillo no funcionan",
        category: PQRCategory.MAINTENANCE,
        priority: PQRPriority.HIGH,
        userId: 1,
        userName: "Juan Pérez",
        userRole: "RESIDENT",
        unitId: 101,
        unitNumber: "101",
        complexId: 1,
      };

      prismaMock.pQRSettings.findFirst.mockResolvedValue({ autoAssignEnabled: true } as any);
      prismaMock.pQRAssignmentRule.findMany.mockResolvedValue([]);
      prismaMock.pQRTeam.findMany.mockResolvedValue([]);
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await service.processPQR(pqrData);

      expect(result).toEqual({
        category: PQRCategory.MAINTENANCE,
        priority: PQRPriority.HIGH,
        tags: expect.any(Array),
      });
      expect(result.category).toBe(PQRCategory.MAINTENANCE);
      expect(result.priority).toBe(PQRPriority.HIGH);
    });

    it("debe categorizar automáticamente un PQR basado en palabras clave", async () => {
      const pqrData = {
        type: "COMPLAINT",
        title: "Problema con la iluminación",
        description: "Las luces del pasillo no funcionan correctamente",
        userId: 1,
        userName: "Juan Pérez",
        userRole: "RESIDENT",
        unitId: 101,
        unitNumber: "101",
        complexId: 1,
      };

      prismaMock.pQRSettings.findFirst.mockResolvedValue({ autoCategorizeEnabled: true, autoAssignEnabled: true } as any);
      prismaMock.pQRAssignmentRule.findMany.mockResolvedValue([]);
      prismaMock.pQRTeam.findMany.mockResolvedValue([]);
      prismaMock.user.findMany.mockResolvedValue([
        {
          id: 5,
          name: "Admin Test",
          role: "COMPLEX_ADMIN",
        },
      ] as any);

      const result = await service.processPQR(pqrData);

      expect(result.category).toBe(PQRCategory.MAINTENANCE);
      expect(result.subcategory).toBe("Eléctrico");
      expect(result.priority).toBe(PQRPriority.MEDIUM);
      expect(result.assignedToId).toBe(5);
      expect(result.assignedToName).toBe("Admin Test");
      expect(result.assignedToRole).toBe("COMPLEX_ADMIN");
      expect(result.tags).toContain("eléctrico");
    });
  });
});
