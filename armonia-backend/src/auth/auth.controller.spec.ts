import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123', schemaName: 'mocked_schema' };
      const mockUser = { id: 1, email: 'test@example.com', role: 'RESIDENT', name: 'Test User', active: true, createdAt: new Date(), updatedAt: new Date(), complexId: 1, passwordResetToken: null, passwordResetExpires: null };
      const mockToken = { access_token: 'mockedAccessToken' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);
      expect(result).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password, loginDto.schemaName);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should return error message on invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword', schemaName: 'mocked_schema' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const result = await authController.login(loginDto);
      expect(result).toEqual({ message: 'Invalid credentials' });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { email: 'new@example.com', password: 'newpassword', name: 'New User', role: 'RESIDENT', schemaName: 'mocked_schema' };
      const createdUser = { id: 2, ...registerDto, active: true, createdAt: new Date(), updatedAt: new Date(), complexId: null, passwordResetToken: null, passwordResetExpires: null };
      jest.spyOn(authService, 'register').mockResolvedValue(createdUser);

      const result = await authController.register(registerDto);
      expect(result).toEqual(createdUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const mockUser = { userId: 1, email: 'test@example.com', role: 'RESIDENT', schemaName: 'mocked_schema' };
      const req = { user: mockUser };

      // Mock the JwtAuthGuard to allow access for this test
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockImplementation(() => true);

      const result = authController.getProfile(req);
      expect(result).toEqual(mockUser);
    });
  });
});