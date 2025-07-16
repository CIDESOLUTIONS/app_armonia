import { generateToken, verifyToken, getJwtSecret } from "../src/lib/auth";
import { SignJWT, jwtVerify } from "jose";

// Mock the jose library
jest.mock("jose", () => {
  const actualAuth = jest.requireActual("../src/lib/auth");
  return {
    SignJWT: jest.fn().mockImplementation(() => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue("mocked-token"),
    })),
    jwtVerify: jest.fn(async (token: string, secret: Uint8Array) => {
      const mockJwtSecret = actualAuth.getJwtSecret();
      if (secret.toString() !== mockJwtSecret.toString()) {
        throw new Error("Invalid secret");
      }
      if (token === "valid-token") {
        return Promise.resolve({
          payload: {
            id: 1,
            email: "test@example.com",
            role: "USER",
            type: "auth",
          },
          protectedHeader: { alg: "HS256" },
        });
      }
      throw new Error("Invalid token");
    }),
  };
});

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret"; // Ensure JWT_SECRET is defined for tests
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  test("generateToken debe generar un token con los datos correctos", async () => {
    const payload = { id: 1, email: "test@example.com", role: "USER" };
    const token = await generateToken(payload);

    expect(token).toBe("mocked-token");
    expect(SignJWT).toHaveBeenCalledTimes(1);
    expect(SignJWT).toHaveBeenCalledWith({ ...payload, type: "auth" });
  });

  test("verifyToken debe retornar los datos del token si es válido", async () => {
    const result = await verifyToken("valid-token");
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      role: "USER",
      type: "auth",
    });
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(jwtVerify).toHaveBeenCalledWith("valid-token", getJwtSecret());
  });

  test("verifyToken debe rechazar si el token es inválido", async () => {
    await expect(verifyToken("invalid-token")).rejects.toThrow("Invalid token");
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(jwtVerify).toHaveBeenCalledWith("invalid-token", getJwtSecret());
  });
});