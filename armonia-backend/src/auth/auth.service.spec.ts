import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

// Mockear el módulo bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let tenantService: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockedAccessToken'),
          },
        },
        {
          provide: TenantService,
          useValue: {
            getTenantSchemaName: jest.fn(() => 'mocked_schema'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    tenantService = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    const commonUserFields = {
      name: 'Test User',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      complexId: 1,
      passwordResetToken: null,
      passwordResetExpires: null,
    };

    it('should return user if credentials are valid', async () => {
      const mockUser = { ...commonUserFields, id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'RESIDENT' };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password123', 'mocked_schema');
      expect(result).toEqual({ ...mockUser, password: undefined });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent@example.com', 'password123', 'mocked_schema');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = { ...commonUserFields, id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'RESIDENT' };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser('test@example.com', 'wrongpassword', 'mocked_schema');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: 'RESIDENT', complexId: 1 };
      jest.spyOn(tenantService, 'getTenantSchemaName').mockResolvedValue('mocked_schema');
      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
        complexId: mockUser.complexId,
        schemaName: 'mocked_schema',
      });
    });
  });

  describe('register', () => {
    const registerData = { email: 'new@example.com', password: 'newpassword', name: 'New User', role: 'RESIDENT', schemaName: 'mocked_schema' };
    const createdUser = { ...registerData, id: 2, active: true, createdAt: new Date(), updatedAt: new Date(), complexId: null, passwordResetToken: null, passwordResetExpires: null };

    it('should create a new user', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await authService.register(registerData);
      expect(result).toEqual(createdUser);
      expect(userService.createUser).toHaveBeenCalledWith(registerData, 'mocked_schema');
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      const existingUser = { ...createdUser, email: 'existing@example.com' };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(existingUser);

      await expect(authService.register(registerData)).rejects.toThrow(UnauthorizedException);
    });
  });
});
