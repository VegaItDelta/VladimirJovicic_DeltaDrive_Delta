import { CacheService } from './cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  it('should initialize with an empty cache', () => {
    expect(cacheService.getAll()).toEqual([]);
    expect(cacheService.isEmpty()).toBe(true);
  });

  it('should set and get data correctly', () => {
    const vehicle1 = { id: '1', make: 'Toyota', model: 'Camry' };
    const vehicle2 = { id: '2', make: 'Honda', model: 'Civic' };

    cacheService.set(vehicle1.id, vehicle1 as any);
    cacheService.set(vehicle2.id, vehicle2 as any);

    expect(cacheService.getAll()).toEqual([vehicle1, vehicle2]);
    expect(cacheService.isEmpty()).toBe(false);
  });

  it('should set and get data correctly for a single vehicle', () => {
    const vehicle = { id: '1', make: 'Toyota', model: 'Camry' };

    cacheService.set(vehicle.id, vehicle as any);

    expect(cacheService.getAll()).toEqual([vehicle]);
    expect(cacheService.isEmpty()).toBe(false);
  });

  it('should check if the cache is empty correctly', () => {
    expect(cacheService.isEmpty()).toBe(true);

    const vehicle = { id: '1', make: 'Toyota', model: 'Camry' };
    cacheService.set(vehicle.id, vehicle as any);

    expect(cacheService.isEmpty()).toBe(false);
  });
});
