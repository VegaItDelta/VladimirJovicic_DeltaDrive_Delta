import { HttpStatus } from '@nestjs/common';
import { PassengersController } from '../../../src/model/passenger/passenger.controller';
import { PassengerService } from '../../../src/model/passenger/passenger.service';

describe('PassengersController', () => {
  let controller: PassengersController;
  let passengerService: PassengerService;

  beforeEach(() => {
    passengerService = {
      register: jest.fn(),
      login: jest.fn(),
    } as any; // Mocking PassengerService methods used in controller
    controller = new PassengersController(passengerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register passenger and send success response', async () => {
      const mockPassengerData = {
        email: 'jon@doe.com',
        password: 'pass'
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.register(mockPassengerData as any, mockResponse);

      expect(passengerService.register).toHaveBeenCalledWith(mockPassengerData);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Registration successful', passengerData: mockPassengerData });
    });

    it('should send error response if registration fails', async () => {
      const mockPassengerData = {
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const mockError = new Error('Registration failed');
      (passengerService.register as any).mockRejectedValueOnce(mockError);

      await controller.register(mockPassengerData as any, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: mockError.message });
    });
  });

  describe('login', () => {
    it('should login passenger and send success response', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'password';
      const mockPassenger = { email: mockEmail };
      const mockSession = { passenger: null };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      (passengerService.login as any).mockResolvedValueOnce(mockPassenger);

      await controller.login(mockEmail, mockPassword, mockSession, mockResponse);

      expect(passengerService.login).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(mockSession.passenger).toEqual({ email: mockEmail });
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: `Login successful ${mockEmail}` });
    });
  });

  describe('logout', () => {
    // Write tests for the logout method
  });
});
