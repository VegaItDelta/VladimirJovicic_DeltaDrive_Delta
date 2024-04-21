import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  it('should set and get individual vehicle correctly', () => {
    const vehicle = { uuid: 'uuid1', id: '1', name: 'Car', type: 'sedan' };
    cacheService.set(vehicle as any);
    const retrievedVehicle = cacheService.get(vehicle.uuid);
    expect(retrievedVehicle).toEqual(vehicle);
  });

  it('should check if cache is empty correctly', () => {
    expect(cacheService.isEmpty()).toBe(true);

    const vehicle = { uuid: 'uuid1', id: '1', name: 'Car', type: 'sedan' };
    cacheService.set(vehicle as any);

    expect(cacheService.isEmpty()).toBe(false);
  });

  it('should add all vehicles correctly', () => {
    const vehicles = [
      { uuid: 'uuid1', id: '1', name: 'Car', type: 'sedan' },
      { uuid: 'uuid2', id: '2', name: 'Truck', type: 'pickup' },
    ];

    cacheService.addAll(vehicles as any);

    expect(cacheService.getAll()).toEqual(vehicles);
  });
});