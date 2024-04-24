import { Test, TestingModule } from '@nestjs/testing';

import { HttpStatus } from '@nestjs/common';
import { VehicleService } from '../../../src/model';
import { VehicleController } from '../../../src/model/vehicle/vehicle.controller';
import { WorkerService } from '../../../src/queue';
import { PositionService } from '../../../src/services';

describe('VehicleController', () => {
  let controller: VehicleController;
  let vehicleService: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            getAllVehicles: jest.fn(),
            findClosestVehicles: jest.fn(),
            getVehicle: jest.fn(),
            book: jest.fn(),
          },
        },
        {
          provide: PositionService,
          useValue: {
            calculateDistance: jest.fn(),
          },
        },
        {
          provide: WorkerService,
          useValue: {
            addToQueue: jest.fn(),
            processQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllVehicles', () => {
    it('should return all vehicles', async () => {
      const vehicles = [{ id: 1, name: 'Vehicle 1' }, { id: 2, name: 'Vehicle 2' }];
      (vehicleService.getAllVehicles as jest.Mock).mockResolvedValue(vehicles);

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.getAllVehicles(response);

      expect(vehicleService.getAllVehicles).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.send).toHaveBeenCalledWith({ message: '2 vehciles found!', data: vehicles });
    });
  });

  describe('bookVehicle', () => {
    it('should handle case where vehicle is already booked', async () => {
      const passengerLatitude = 1;
      const passengerLongitude = 2;
      const destinationLatitude = 3;
      const destinationLongitude = 4;
      const uuid = 'vehicle123';
      const email = 'test@example.com';
      const vehicle = { uuid, booked: true };

      (vehicleService.getVehicle as jest.Mock).mockResolvedValue(vehicle);

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.bookVehicle(
        passengerLatitude,
        passengerLongitude,
        destinationLatitude,
        destinationLongitude,
        uuid,
        { passenger: { email } },
        response
      );

      expect(vehicleService.getVehicle).toHaveBeenCalledWith(uuid);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.send).toHaveBeenCalledWith({ message: 'This vehicle is already booked. Please choose another one.' });
    });

    it('should handle case where driver declines the ride', async () => {
      const passengerLatitude = 1;
      const passengerLongitude = 2;
      const destinationLatitude = 3;
      const destinationLongitude = 4;
      const uuid = 'vehicle123';
      const email = 'test@example.com';
      const vehicle = { uuid, booked: false };

      (vehicleService.getVehicle as jest.Mock).mockResolvedValue(vehicle);
      jest.spyOn(global.Math, 'random').mockReturnValue(0.3);

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.bookVehicle(
        passengerLatitude,
        passengerLongitude,
        destinationLatitude,
        destinationLongitude,
        uuid,
        { passenger: { email } },
        response
      );

      expect(vehicleService.getVehicle).toHaveBeenCalledWith(uuid);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.send).toHaveBeenCalledWith({ message: expect.stringContaining('Thank you for choosing Delta Drive. The vehicle will arrive soon.') });
    });
  });
});
