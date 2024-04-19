import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  it('should set and get individual vehicle correctly', () => {
    const vehicle = { id: '1', name: 'Car', type: 'sedan' };
    cacheService.set(vehicle.id, vehicle as any);
    const retrievedVehicle = cacheService.get(vehicle.id);
    expect(retrievedVehicle).toEqual(vehicle);
  });

  it('should check if cache is empty correctly', () => {
    expect(cacheService.isEmpty()).toBe(true);

    const vehicle = { id: '1', name: 'Car', type: 'sedan' };
    cacheService.set(vehicle.id, vehicle as any);

    expect(cacheService.isEmpty()).toBe(false);
  });

  it('should add all vehicles correctly', () => {
    const vehicles = [
      { id: '1', name: 'Car', type: 'sedan' },
      { id: '2', name: 'Truck', type: 'pickup' },
    ];

    cacheService.addAll(vehicles as any);

    expect(cacheService.getAll()).toEqual(vehicles);
  });
});