import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validator from 'validator';
import { Passenger } from '../../../src/model/passenger/passenger';
import { PassengerService } from '../../../src/model/passenger/passenger.service';

// Mock the Passenger model
const mockPassengerModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

// Mock bcrypt functions
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock validator functions
jest.mock('validator', () => ({
  isEmail: jest.fn(),
}));

describe('PassengerService', () => {
  let passengerService: PassengerService;

  beforeEach(() => {
    passengerService = new PassengerService(mockPassengerModel as unknown as Model<Passenger>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new passenger', async () => {
      const passengerData = {
        email: 'test@example.com',
        password: 'password',
        exec: () => { }
      };

      (validator.isEmail as jest.Mock).mockReturnValue(true);
      mockPassengerModel.findOne.mockReturnValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPassengerModel.create.mockResolvedValueOnce(passengerData);

      await passengerService.register(passengerData as any);

      expect(validator.isEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockPassengerModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(mockPassengerModel.create).toHaveBeenCalledWith({
        ...passengerData,
        email: 'test@example.com',
        password: 'hashedPassword',
      });
    });

    it('should throw BadRequestException if email is invalid', async () => {
      const passengerData = {
        email: 'invalid-email',
        password: 'password',
      };

      (validator.isEmail as jest.Mock).mockReturnValue(false);

      await expect(passengerService.register(passengerData as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login a passenger', async () => {
      const passengerData = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const passenger = {
        email: 'test@example.com',
        password: 'hashedPassword',
        exec: () => jest.fn().mockResolvedValue(passengerData)
      };

      mockPassengerModel.findOne.mockReturnValue(passenger);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loggedInPassenger = await passengerService.login('test@example.com', 'password');

      expect(loggedInPassenger.email).toEqual(passengerData.email);
      expect(mockPassengerModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });

    it('should throw UnauthorizedException if email does not exist', async () => {
      mockPassengerModel.findOne.mockReturnValue(null);

      await expect(passengerService.login('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const passenger = {
        email: 'test@example.com',
        password: 'hashedPassword',
        exec: () => { }
      };

      mockPassengerModel.findOne.mockReturnValue(passenger);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(passengerService.login('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });
});