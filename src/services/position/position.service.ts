import { Vehicle } from './../../model/vehicle/vehicle';
import { Injectable } from '@nestjs/common';
import { Position } from './position';

const VEHICLE_SPEED = 20000; // km/h
const UPDATE_POSITION_INTERVAL = 5000; // update the current position each n miliseconds
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

  /**
   * Simulates moving from the start to end.
   * The speed and update log interval are configurable with VEHICLE_SPEED and UPDATE_POSITION_INTERVAL
   * @param start The start position
   * @param end The destination position 
   */
  public async move(vehicle: Vehicle, start: Position, end: Position): Promise<void> {
    const currentPosition = start;
    const distance = this.calculateDistance(start, end);

    const timeToReachTarget = (distance / VEHICLE_SPEED) * 3600 * 1000; 
    let steps = Math.ceil(timeToReachTarget / UPDATE_POSITION_INTERVAL);

    const stepLat = (end.latitude - currentPosition.latitude) / steps;
    const stepLng = (end.longitude - currentPosition.longitude) / steps;

    return new Promise<void>((resolve) => {
      const intervalId = setInterval(() => {
        const distanceLeft = this.calculateDistance(currentPosition, end);
        console.table({
          'Driver': `${vehicle.firstName} ${vehicle.lastName}`,
          'Brand': vehicle.brand,
          'Current latitude': currentPosition.latitude,
          'Current longitude': currentPosition.longitude,
          'Distance left': distanceLeft,
        });
        if (steps <= 0) {
          end.latitude = +end.latitude;
          end.longitude = +end.longitude;
          currentPosition.latitude = +end.latitude;
          currentPosition.longitude = +end.longitude;
          clearInterval(intervalId);
          resolve();
        }
        currentPosition.latitude += stepLat;
        currentPosition.longitude += stepLng;
        steps--;
  
        }, UPDATE_POSITION_INTERVAL);
    });
 }

} 