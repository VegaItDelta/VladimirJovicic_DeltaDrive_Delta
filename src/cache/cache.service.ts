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
   * @param data The vehicle data to set
   */
  public set(data: Vehicle): void {
    this.cache.set(data.uuid, data);
  }

    /**
   * Gets an individual vehicle
   * @param uuid The uuid of the vehicle
   */
    public get(uuid: string): Vehicle | null {
      return this.cache.get(uuid) || null;
    }

  /**
   * Checks if the cache data is empty
   * @returns true if the cache is empty. Otherwise false
   */
  public isEmpty(): boolean {
    return this.cache.size === 0;
  }

  /**
   * Adds the whole array to the cache
   * @param vehicles The array to add
   */
  public addAll(vehicles: Vehicle[]): void {
    vehicles.forEach(v => this.set(v));
  }
}
