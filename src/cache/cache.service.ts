import { Injectable } from '@nestjs/common';
import { Vehicle } from '../model/vehicle/vehicle';

/**
 * Service that contains the cache and methods for manipulating the cache
 */
@Injectable()
export class CacheService {
  private cache: Map<string, Vehicle> = new Map();

  /**
   * Get the whole cashe data
   * @returns The whole cache
   */
  public getAll(): Vehicle[] {
    return Array.from(this.cache.values());
  }

  /**
   * Sets an individual vehicle
   * @param id The id of the vehicle
   * @param data The vehicle data to set
   */
  public set(id: string, data: Vehicle): void {
    this.cache.set(id, data);
  }

  /**
   * Checks if the cache data is empty
   * @returns true if the cache is empty. Otherwise false
   */
  public isEmpty(): boolean {
    return this.cache.size === 0;
  }
}
