import { Injectable } from '@nestjs/common';
import { Position } from './position';

@Injectable()
export class PositionService {
     /**
   * Calculate distance between two points.
   * Using the Haversine formula.
   * https://en.wikipedia.org/wiki/Haversine_formula
   * @param point1 The first position
   * @param point2 The first position
   * @returns The distance between two points
   */
  public calculateDistance(point1: Position, point2: Position): number {
    const R = 6371; // Radius of the Earth in kilometers
    const latitude1 = point1.latitude;
    const longitude1 = point1.longitude;
    const latitude2 = point2.latitude;
    const longitude2 = point2.longitude;
  
    const latitudeDistance = this.toRadians(latitude2 - latitude1);
    const longitudeDistance = this.toRadians(longitude2 - longitude1);
  
    const a =
      Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
      Math.cos(this.toRadians(latitude1)) * Math.cos(this.toRadians(latitude2)) * Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
  }

  /**
   * Convert the degrees to radians
   * @param degrees The angle in degrees
   * @returns The value of the angle in radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}