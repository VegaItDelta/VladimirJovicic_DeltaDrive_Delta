import { VehicleService } from "../../../src/model";

describe('VehicleService', () => {
  const vehicleModelMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn()

  };
  const cacheServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    isEmpty: jest.fn(),
    getAll: jest.fn(),
    addAll: jest.fn()
  };
  const positionServiceMock = {
    calculateDistance: jest.fn()
  };
  const reviewServiceMock = {
    getVehicleReviews: jest.fn()
  };

  const vehicleService = new VehicleService(vehicleModelMock as any, cacheServiceMock as any, positionServiceMock as any, reviewServiceMock as any);

  it('should create the service', () => {
    expect(vehicleService).toBeDefined();
  })

  describe('getAllVehicles', () => {
    it('should call cacheService.getAll when cache is not empty', async () => {
      cacheServiceMock.isEmpty.mockReturnValueOnce(false);
      await vehicleService.getAllVehicles();
      expect(cacheServiceMock.getAll).toHaveBeenCalled();
    });

    it('should call vehicleModel.find when cache is not empty', async () => {
      cacheServiceMock.isEmpty.mockReturnValueOnce(true);
      await vehicleService.getAllVehicles();
      expect(vehicleModelMock.find).toHaveBeenCalled();
    });

    it('should call cacheService.addAll when cache is not empty', async () => {
      cacheServiceMock.isEmpty.mockReturnValueOnce(true);
      const mockVehicles = 'mockVehicles';
      vehicleModelMock.find.mockReturnValueOnce(mockVehicles);
      await vehicleService.getAllVehicles();
      expect(cacheServiceMock.addAll).toHaveBeenCalledWith(mockVehicles);
    });
  });

  describe('getVehicle', () => {
    const uuidMock = 'uuidMock';
    it('should vehicleModel.findOne when the cache is empty', async () => {
      cacheServiceMock.isEmpty.mockReturnValueOnce(true);
      await vehicleService.getVehicle(uuidMock);
      expect(vehicleModelMock.findOne).toHaveBeenCalledWith({ uuid: uuidMock });
    });

    it('should cacheService.get when the cache is not empty', async () => {
      cacheServiceMock.isEmpty.mockReturnValueOnce(false);
      await vehicleService.getVehicle(uuidMock);
      expect(cacheServiceMock.get).toHaveBeenCalledWith(uuidMock);
    });
  });

  describe('findClosestVehicles', () => {
    it('should return closest vehicles with reviews and average rating', async () => {
      const userPosition = { latitude: 0, longitude: 0 };
      const vehicles = [
        { uuid: '1', booked: false, latitude: 1, longitude: 1, pricePerKM: 0.5, startPrice: 10 },
        { uuid: '2', booked: false, latitude: 2, longitude: 2, pricePerKM: 0.7, startPrice: 15 },
      ] as any[];
      const count = 2;
      const distanceToDestination = 10;

      positionServiceMock.calculateDistance.mockReturnValue(5);
      reviewServiceMock.getVehicleReviews.mockResolvedValue([{ rate: 4 }, { rate: 5 }]);

      const result = await vehicleService.findClosestVehicles(userPosition, vehicles, count, distanceToDestination);

      expect(positionServiceMock.calculateDistance).toHaveBeenCalledTimes(2);
      expect(reviewServiceMock.getVehicleReviews).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].vehicle.uuid).toBe('1');
      expect(result[0].averageRating).toBeCloseTo(4.5);
      expect(result[0].price).toBe(15);

    });

    it('should skip booked vehicles', async () => {
      const userPosition = { latitude: 0, longitude: 0 };
      const vehicles = [
        { uuid: '1', booked: true, latitude: 1, longitude: 1, pricePerKM: 0.5, startPrice: 10 },
        { uuid: '2', booked: false, latitude: 2, longitude: 2, pricePerKM: 0.7, startPrice: 15 },
      ];
      const count = 1;
      const distanceToDestination = 10;

      positionServiceMock.calculateDistance.mockReturnValue(5);

      const result = await vehicleService.findClosestVehicles(userPosition, vehicles as any[], count, distanceToDestination);

      expect(result).toHaveLength(1);
      expect(result[0].vehicle.uuid).toBe('2');
    });
  });

  describe('book', () => {
    const uuidMock = 'uuidMock';
    const vehicleMockInput = {
      uuid: uuidMock,
      booked: false
    }

    const vehicleMockTransformed = {
      uuid: uuidMock,
      booked: true
    }
    it('should call cacheService.set with the vehicle.book assigned to true', async () => {
      vehicleModelMock.updateOne.mockReturnValueOnce({
        exec: () => { }
      });
      await vehicleService.book(vehicleMockInput as any);
      expect(cacheServiceMock.set).toHaveBeenCalledWith(vehicleMockTransformed);
    });

    it('should call vehicleModel.updateOne with the correct data', async () => {
      vehicleModelMock.updateOne.mockReturnValueOnce({
        exec: () => { }
      });
      await vehicleService.book(vehicleMockInput as any);

      const expectedInput = {
        uuid: uuidMock,
      }
      expect(vehicleModelMock.updateOne).toHaveBeenCalledWith(expectedInput, vehicleMockTransformed);
    });
  });

  describe('finishRide', () => {
    const uuidMock = 'uuidMock';
    const newLocationMock = {
      longitude: 5,
      latitude: 5,
    }
    const vehicleMockInput = {
      uuid: uuidMock,
      longitude: 0,
      latitude: 0,
      booked: true
    };

    const vehicleMockTransformed = {
      uuid: uuidMock,
      longitude: 5,
      latitude: 5,
      booked: false
    }
    it('should call cacheService.set with the vehicle.book assigned to false', async () => {
      vehicleModelMock.updateOne.mockReturnValueOnce({
        exec: () => { }
      });
      await vehicleService.finishRide(vehicleMockInput as any, newLocationMock);
      expect(cacheServiceMock.set).toHaveBeenCalledWith(vehicleMockTransformed);
    });

    it('should call vehicleModel.updateOne after finish data with the correct data', async () => {
      vehicleModelMock.updateOne.mockReturnValueOnce({
        exec: () => { }
      });
      await vehicleService.finishRide(vehicleMockInput as any, newLocationMock);

      const expectedInput = {
        uuid: uuidMock,
      }
      expect(vehicleModelMock.updateOne).toHaveBeenCalledWith(expectedInput, vehicleMockTransformed);
    });
  });
});